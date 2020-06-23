import React from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Layout, Menu, Table, Rate} from 'antd';
import {getNeighbourhood} from './ListFunctions';
import CanvasJSReact from './canvasjs.react';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const { Header, Content, Footer, Sider } = Layout;

class Chart_2 extends React.Component {
    constructor() {
        super()
        this.state = {
            Neighbourhood: [],
            dataPoints: []
        };

        }
        componentDidMount() {
            this.getAll()
        }
        getAll = () => {
            var chart = this.chart;
            getNeighbourhood().then(data => {
            data.sort(function(a,b) {
                return a.price - b.price;
            });
            for (var i = 0; i < data.length; i++) {
				this.state.dataPoints.push({
					label: data[i]._id,
                    y: data[i].price
                    
                });
             
            }
          
            chart.render();
          })
        }
      render() {
        const options = {
			animationEnabled: true,
			title: {
				text: "Average price in each neighbourhood"
			},
			axisX: {
				title: "Neighbourhood"			
			},
			axisY: {
                title: "Price ($)",
                maximum: 220				
			},
			data: [{
				type: "column",
               // showInLegend: true,
               // legendText: "{label}",
                // indexLabel: "${y}",
                // indexLabelPlacement: "inside",
				//yValueFormatString: "#,###'%'",
				dataPoints: this.state.dataPoints		
				
			}]
		}
          return ( <Content style={{ padding: '0 24px', minHeight: 280}}>
              <CanvasJSChart options = {options}
				onRef={ref => this.chart = ref} 
			/>
           </Content>  
          );
      }
  }
  
  export default Chart_2