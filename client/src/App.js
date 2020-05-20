import React, {setState } from 'react';
import './App.css';
import $ from 'jquery';
import axios from 'axios';
import HighChartHistogram from './HighChartHistogram.js'
import HighChartPie from './HighChartPie.js'
import { cpus } from 'os';

const win_words = new Set(['win', 'abandoned']);
const draw_words = new Set(['stalemate', 'repetition', 'insufficient', 'agreed', 'timevsinsufficient']);
const loss_words = new Set(['checkmated', 'resigned', 'timeout']);
var blackdict = {};
var whitedict = {};
var user_name = ':'

$.ajaxSetup({
  async: false
});
class App extends React.Component {
  constructor(props) {
    super(props)
    this.handler = this.handler.bind(this)
    this.handleChange = this.handleChange.bind(this);
    var sampleData = [{"ECO":"D30","wins":9,"losses":71,"draws":5},{"ECO":"C00","wins":90,"losses":65,"draws":1},{"ECO":"D06","wins":85,"losses":46,"draws":2},{"ECO":"D31","wins":83,"losses":52,"draws":5},{"ECO":"D10","wins":67,"losses":67,"draws":5},{"ECO":"A40","wins":59,"losses":41,"draws":0},{"ECO":"D35","wins":43,"losses":31,"draws":2},{"ECO":"B00","wins":30,"losses":24,"draws":2},{"ECO":"B06","wins":29,"losses":21,"draws":0},{"ECO":"B07","wins":27,"losses":25,"draws":0}];
    var bsampleData = [{"ECO":"D30","wins":90,"losses":47,"draws":5},{"ECO":"C00","wins":59,"losses":56,"draws":19},{"ECO":"D06","wins":48,"losses":24,"draws":20},{"ECO":"D31","wins":8,"losses":65,"draws":5},{"ECO":"D10","wins":67,"losses":79,"draws":5},{"ECO":"A40","wins":59,"losses":51,"draws":0},{"ECO":"D35","wins":43,"losses":71,"draws":2},{"ECO":"B00","wins":30,"losses":54,"draws":2},{"ECO":"B06","wins":29,"losses":43,"draws":0},{"ECO":"B07","wins":27,"losses":15,"draws":0}];

    this.state = {barData: {'black': bsampleData, 'white': sampleData}, pieData: {'black': [{name:'win',y:3}, {name:'timeout',y:2}], 'white': [{name:'win',y:3}, {name:'agreed',y:1}, {name:'resigned',y:2}]}, colour: 'white'}
  }

  handler(d,p) {
    this.setState({barData : d})
    this.setState({pieData: p}
    )
  }
  handleChange(event) {
    this.setState({
      colour: event.target.value})
  }
  render () {
    //console.log('renderpie',this.state.pieData[this.state.colour])
    //console.log('keyslength', Object.keys(this.state.barData).length)
    if (Object.keys(this.state.barData).length > 0) {
      return (
        <div className="App" style={{textAlign: 'center'}}>
          <div>
            Openings with worst peformance for {user_name}
          </div>
          <div className="user-input">
            <UserNameForm action = {this.handler}/>
          </div>
          <form>
            <label>As White</label>
              <input type="radio" checked={this.state.colour === 'white'} value="white" onChange={this.handleChange}/>
              <label>As Black</label>
              <input type="radio" checked={this.state.colour === 'black'} value="black" onChange={this.handleChange}/>
          </form>
          
          
          <div className="Chart">
            <HighChartHistogram 
              data={this.state.barData}
              colour={this.state.colour}
              />
          </div>
           <div className="Pie">
            <HighChartPie
            data = {this.state.pieData}//{Object.entries(this.state.pieData[this.state.colour]).map(x=>x[1])}
            colour = {this.state.colour}
            />
          </div>
        </div>
      );
      }
    // else {
    //   return (
    //     <div className="App" style={{textAlign: 'center'}}>
    //       <div style={{paddingBottom: 25}}>
    //       Enter your username to see what openings you have the most trouble with
    //       </div>
    //       <div className="user-input">
    //         <UserNameForm action={this.handler}/>
    //       </div>
    //       <div className="Chart">
    //         <HighChartHistogram
    //           data={this.state.barData[this.state.colour]}
    //           />
    //       </div>
    //     </div>
    //   );
    // }
    }
  }
export default App;

  class UserNameForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {value: '', ChartData: {'white':[], 'black':[]}, results: {'white':[], 'black':[]} };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {
      this.setState({value: event.target.value});
    }
    async handleSubmit(event) {
      event.preventDefault();
      let user = this.state.value;
      user_name = user;
      let res = await axios.get('/api/get/datafromusername', {
            params : {
              username: user}
            })
      console.log('res ', res)
      this.setState({results: res.data[1]})
      this.setState({ChartData: res.data[0]}, async function() {
        if (this.state.ChartData['white'].length === 0) {
          //await load_dict(user)
          await get_json(user)
          //console.log('whitedict', whitedict)
          let [loaded_data, results] = await populate_chart_data(user);
          //console.log('load', loaded_data)
          this.setState({results: results})
          this.setState({ChartData : loaded_data}, function() {

            this.state.ChartData['white'].sort(function(a,b) {
              return b.losses - a.losses})
            this.state.ChartData['black'].sort(function(a,b) {
              return b.losses - a.losses})

            // this.props.action(this.state.ChartData, this.state.results)
          })
          //console.log('post-load-state', this.state)
          axios.post('/api/post/data', {
            username: user,
            chartdata: {white: this.state.ChartData['white'],
            black: this.state.ChartData['black']},
            results: results},
            {headers: {'Content-Type': 'application/json'}}//'application/x-www-form-urlencoded'}}
          )
          .then(result => console.log(result))
          .catch(err => console.log('there was an error: ', err))
        } 
          //console.log('state', this.state)
          this.props.action(this.state.ChartData, this.state.results)
    }
      )
    }
   
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            <input type="text" value={this.state.value} onChange={this.handleChange} placeholder="Enter Your Chess.com Username!" size="29"/>
          </label>
          <input type="submit" value="Submit" style={{margin:10}} />
        </form>
      );
    }
  }

  async function load_dict(user) {
    let urls = await get_json(user);
    //console.log('urls', urls)
    if (typeof(urls) != "undefined") {
      urls.forEach(async function(url) {
        let month_data = await month_json(url);
        addData(month_data.games)
      })
    }
  }
  async function get_json(input_text) {
    whitedict = {};
    user_name = input_text.toLowerCase();
    var archive_url = 'https://api.chess.com/pub/player/' + user_name + '/games/archives';
    $.getJSON(archive_url, function(data) {
        var urls = Object.values(data.archives)
        //console.log('urls', urls)
        urls.forEach(async function(url) {
          $.getJSON(url, function(data) {
            //console.log('games', data.games)
            addData(data.games)
          })
        })
      })
    }

  async function month_json(url) {
    //var month = url.slice(url.length-2, url.length);
    //var year = url.slice(url.length-7, url.length - 3);
    var games;
    $.getJSON(url, function(data) {
        games = data.games
        return {games: games} //month: month, year: year}
    })
    }

    async function addData(data, month, year) {
      var result;
      user_name = data[0].white.username.toLowerCase() === user_name.toLowerCase() ? data[0].white.username : data[0].black.username
      for (var i = 0; i < data.length; i++) {
        if (data[i].rules !== 'chess') {
          continue
        }
        var idx = data[i].pgn.indexOf('ECO');
        var ECO = data[i].pgn.slice(idx+5, idx+8);
        if (data[i].white.username === user_name) {
          result = data[i].white.result;
          if (!(ECO in whitedict)) {
            whitedict = {...whitedict, [ECO]: {[result]:1} };
          } 
          else {
            if (!(result in whitedict[ECO])) {
              whitedict[ECO] = { ...whitedict[ECO], [result]: 1 };
              }
            else {
              var newval = whitedict[ECO][result] + 1;
              whitedict[ECO] = {...whitedict[ECO], [result]: newval};
              }
            }
          }
        else {
          result = data[i].black.result;
          if (!(ECO in blackdict)) {
            blackdict = { ...blackdict, [ECO]: {[result]:1} };
            } 
          else {
            if (!(result in blackdict[ECO])) {
              blackdict[ECO] = { ...blackdict[ECO], [result]: 1 };
            }
            else {
              blackdict[ECO][result] = blackdict[ECO][result] + 1;
            }
          }
        }
      }
    }

  async function populate_chart_data(user) {
      //console.log('populate', whitedict)
      var loaded_data = {'white': [], 'black': []};
      var results = {'white': {}, 'black': {}}
      for (var key in whitedict) {
        if (whitedict.hasOwnProperty(key)) {
            var obj = whitedict[key];
            var wins = 0;
            var losses = 0;
            var draws = 0;
            for (var val in obj) {
              if (results['white'].hasOwnProperty(val)) {
                results['white'][val] += 1
              } else {
                results['white'][val] = 1
              }
              if (obj.hasOwnProperty(val)) {
                if (win_words.has(val)) {
                  wins += whitedict[key][val]
                }
                if (draw_words.has(val)) {
                  draws += whitedict[key][val]
                }
                if (loss_words.has(val)) {
                  losses += whitedict[key][val]
                }
              }
            }
          loaded_data['white'].push({'ECO':key, 'wins':wins, 'losses':losses,'draws':draws})
          }
        }
        for (var key in blackdict) {
          if (blackdict.hasOwnProperty(key)) {
              var obj = blackdict[key];
              var wins = 0;
              var losses = 0;
              var draws = 0;
              for (var val in obj) {
                if (results['black'].hasOwnProperty(val)) {
                  results['black'][val] += 1
                } else {
                  results['black'][val] = 1
                }
                if (obj.hasOwnProperty(val)) {
                  if (win_words.has(val)) {
                    wins += blackdict[key][val]
                  }
                  if (draw_words.has(val)) {
                    draws += blackdict[key][val]
                  }
                  if (loss_words.has(val)) {
                    losses += blackdict[key][val]
                  }
                }
              }
            loaded_data['black'].push({'ECO':key, 'wins':wins, 'losses':losses,'draws':draws})
            }
          }
    
      results['white'] = Object.entries(results['white']).map(function(x) {
        return {name:[x[0]], y: x[1]}
      })
      results['black'] = Object.entries(results['black']).map(function(x) {
        return {name: [x[0]], y: x[1]}
      })
      //console.log('results', results)
      return [loaded_data, results]
    }

  

  

    // after username form is submitted, a get request is made to check if user is in database.
    // if in database: returns userdata which is used with setState to change chart appearance
    // if not in database, chess.com api call is made, data is loaded and posted to database.
    // if color is changed, state needs to be updated. do charts respond to this?