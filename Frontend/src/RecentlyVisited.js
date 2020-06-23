import React from 'react';
import './App.css';
import 'antd/dist/antd.css';
import SignIn from './SignIn';
import {getRecentlyVisited} from './ListFunctions';
import { Layout, Menu, Table, Rate } from 'antd';
import axios from 'axios'


const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;
const columns = [
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
      ellipsis: true,
    },
    {
      title: 'Neighbourhood',
      key: 'neighbourhood',
      dataIndex: 'neighbourhood',      
      
    },
    {
      title: 'Property Type',
      dataIndex: 'property_type',
      key: 'property_type',     
      
    },
    {
      title: 'Room Type',
      dataIndex: 'room_type',
      key: 'room_type',     
      filters: [
        {
          text: 'Private room',
          value: 'Private room',
        },
        {
          text: 'Entire home/apt',
          value: 'Entire home/apt',
        },
        {
          text: 'Shared room',
          value: 'Shared room',
        },        
        {
           text: 'Apartment',
           value: 'Apartment',
        },
        {
           text: 'Hotel room',
           value: 'Hotel room',
        },
        {
           text: 'Guest suite',
           value: 'Guest suite',
        },
        {
           text: 'House',
           value: 'House',
        },
      ], 
      onFilter: (value, record) => record.room_type.indexOf(value) === 0, 
    },
    {
      title: 'Accommodates',
      dataIndex: 'accommodates',
      key: 'accommodates',               
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',  
      sorter: (a, b) => parseInt(a.price.replace("$","")) - parseInt(b.price.replace("$","")),     
      defaultSortOrder: 'descend',        
    }, 
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',  
      render: theRating => <Rate disabled allowHalf value={roundHalf(theRating)}  style={{ fontSize: 16 }} />     
    }, 
  ];
  
  function onChange(pagination, filters, sorter, extra) {
    console.log('params', pagination, filters, sorter, extra);
  }
  function roundHalf(num) {
    return Math.round(num*2)/2;
  }

class RecentlyVisited extends React.Component {
  constructor() {
    super()
    this.state = {
        recentlyvisited: [],
    };
    }
   
    componentDidMount() {
      const userID = JSON.parse(localStorage.getItem('user')).id;
      this.getAll(userID)
  }
  getAll = id => {
    getRecentlyVisited(id).then(data => {
      const recentlyvisited = data
      this.setState({recentlyvisited})
    })
  }
  
    render() {
        return ( <Content style={{ padding: '0 24px', minHeight: 280}}>
            <Table 
                scroll={{ x: 500 ,y: 400 }} 
                columns={columns} 
                dataSource={this.state.recentlyvisited}
                onChange={onChange} 
                pagination={{ pageSize: 20 }}                
            /> </Content>  
            );
    }
}

export default RecentlyVisited;