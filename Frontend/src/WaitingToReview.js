import React, { useContext, useState, useEffect, useRef } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import {getWaitingToReview,deleteReview,addReview,ALSRecommendation,SVDRecommendation} from './ListFunctions';
import { Table, Input, Button, Popconfirm, Form, Menu, Layout, message} from 'antd';

const {Content } = Layout;
const successMessageALS = () => {
  message.success('ALS recommendation ended successfully',10000);
};
const successMessageSVD = () => {
  message.success('SVD recommendation ended successfully',11000);
};
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
class WaitingToReview extends React.Component {
  
  constructor(props) {
    
    super(props);
    this.state = {
      dataSource: [],
      userID: JSON.parse(localStorage.getItem('user')).id,
      value: ''    
    };

    this.columns = [
      {
        title: 'ID',
        dataIndex: 'listing_id',
        key: 'listing_id', 
      },
      {
        title: 'Picture',
        dataIndex: 'picture_url',
        render: theImageURL => <img alt={theImageURL} src={theImageURL} width={100} height={100} />
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',        
      },
      {
        title: 'Review',
        dataIndex: 'review',
        width: '30%',
        render: () =>{
          return(
          <Input type = 'text'  placeholder = "Add review" onChange={this.handleChange}/>
          );
        },     
      },
      {
        title: '',
        dataIndex: 'operation',
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm title="Sure to submit?" onConfirm={() => {this.onAdd(record.listing_id);this.handleDelete(record.listing_id)}} >
              <span style={{color:"blue"}}>
                 <a>Submit</a> 
              </span> 
            </Popconfirm>
          ) : null,
      },
    ];
  }

  componentDidMount() {
    this.getAll(this.state.userID)
  }

  getAll = id => {
    getWaitingToReview(id).then(data => {
      const dataSource = data
      this.setState({dataSource})
      })
  }

  handleChange =(event)=> {
    this.setState({value: event.target.value});
  }

  handleDelete = (hotelid) => {
    deleteReview(this.state.userID,hotelid)     
   
  };

  onAdd(hotelid){    
    const add = addReview(parseInt(this.state.userID),hotelid,this.state.value)
    console.log(this.state.userID,hotelid,this.state.value)
    add.then(function(result){
      if(result == 204)
      {
        console.log('ffff')        
        
      ALSRecommendation().then(function(result){
        if(result == 201)
        {
          successMessageALS()
        }
      })
      SVDRecommendation().then(function(result){
       if(result == 201)
       {
         successMessageSVD()
       }
     })
     sleep(4000).then(() => {
      window.location.reload();
    });
       
      }  
    })
    
  }
  
  render() {  
      return ( <Content style={{ padding: '0 24px', minHeight: 280}}>
             
            <Table 
                scroll={{ x: 500 ,y: 400 }} 
                columns={this.columns} 
                dataSource={this.state.dataSource}                
                pagination={{ pageSize: 20 }}                
            />
            
       </Content> 
             );
    }
}

export default WaitingToReview