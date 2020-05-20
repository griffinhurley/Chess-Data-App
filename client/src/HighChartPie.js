import React, { Component } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

class HighChartPie extends Component {
    constructor(props) {
        super(props)
        
    }
    render () {
        // var data = this.props.data[this.props.colour]
        // console.log('pie', data)
        // data should be array of {name : y}
        // name will be loss/win types, loss for now, and y will be total? no percentage. need to calculate. 
        let options = {
            chart: {
                backgroundColor: "#282c34",
                plotBackgroundColor: '#d3d3d3',
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Results As ' + (this.props.colour === 'white' ? 'White' : 'Black'),
                style: {
                    color: '#ffffff'
                }
            },
            tooltip: {
                headerFormat: '',
                pointFormat: '<b>{point.name}</b>: <b>{point.percentage:.1f}%</b>'
            },
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        color: '#282c34',
                        borderColor: '#282c34',
                        contrast: false,
                        style: {
                            textOutline: '0px',
                            fontSize: '14px'
                        }
                        //backgroundColor: '#282c34'

                    }
                }
            },
            series: [{
                colorByPoint: true,
                data: this.props.data[this.props.colour]
            }]
        }
        return (
            <div >
              <HighchartsReact
                highcharts={Highcharts}
                options={options}
              />
            </div>
          )
        }
      }
      export default HighChartPie