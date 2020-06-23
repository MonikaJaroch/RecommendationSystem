import React from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Layout, Menu, Table, Rate} from 'antd';
import {getRoomTypeChart} from './ListFunctions';
import CanvasJSReact from './canvasjs.react';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const { Header, Content, Footer, Sider } = Layout;

class Chart_1 extends React.Component {
    constructor() {
        super()
        this.state = {
            RoomType: [],
            dataPoints: []
        };

        }
        componentDidMount() {
            this.getAll()
        }
        getAll = () => {
            var chart = this.chart;
            getRoomTypeChart().then(data => {
            data.sort(function(a,b) {
                return a.count - b.count;
            });
            for (var i = 0; i < data.length; i++) {
				this.state.dataPoints.push({
					label: data[i]._id,
                    y: data[i].count
                    
                });
             
            }
          
            chart.render();
          })
        }
      render() {
        const options = {
			animationEnabled: true,
			title: {
				text: "Overall view of room type"
			},
			
			data: [{
				type: "pie",
                showInLegend: true,
                legendText: "{label}",
				indexLabel: "{label}: {y}",
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
  
  export default Chart_1