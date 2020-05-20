import React, { Component } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

class HighChartHistogram extends Component {
    constructor(props) {
        super(props)
    }
  
    render () {
        var colour = this.props.colour

        var data = this.props.data[colour].slice(0,10)
        //console.log('histogram', data)
        let x_vals = data.map(obj => obj.ECO)
        let y_vals = data.map(obj => obj.losses)
        let options = {
            chart: {
                backgroundColor: "#282c34",
                plotBackgroundColor: '#d3d3d3',
                type: 'column'
            },
            title: {
                text: ''
            },
            legend: {
                enabled: false
            },
            xAxis: {
                
              categories: 
                x_vals
            ,

              title: {
                  text: 'ECO',
                  style: {
                    color: '#ffffff',
                    fontSize: '24px'
                }
              }
            ,
              labels: {
                  style: {
                      color: '#ffffff'
                  }
              }
            },
            yAxis: {
                title: {
                    text: 'Losses',
                    style: {
                        color: '#ffffff',
                        fontSize: '24px'
                    }
                }
                ,
                labels: {
                    style: {
                        color: '#ffffff'
                    }
                }
            },
            series: [
                {
                colorByPoint: true,
                data: y_vals
                }
            ],
            tooltip: {
                pointFormat: 'Losses' + ': <b>{point.y}</b><br/>'
            }


            }
       
    return (
      <div>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </div>
    )
  }
}
export default HighChartHistogram
