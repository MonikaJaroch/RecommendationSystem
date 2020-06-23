import React from 'react';
import './App.css';
import 'antd/dist/antd.css';
import {getRecommendationSVD} from './ListFunctions';
import { Layout, Menu, Table, Rate} from 'antd';

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
  // const data = [
  //   {
  //     key: '1',
  //     listing_id: 5178,
  //     picture_url: 'https://a0.muscache.com/im/pictures/12065/f070997b_original.jpg?aki_policy=large',
  //     name: 'Large Furnished Room Near B way',
  //     neighbourhood: 'Manhattan',      
  //     room_type: 'Private room',
  //     accommodates: 2,
  //     price: '$79.00',
  //     rating: 4.4,
  //   },
  //   {
  //     key: '2',
  //     listing_id: 5203,
  //     picture_url: 'https://a0.muscache.com/im/pictures/103776/b371575b_original.jpg?aki_policy=large',
  //     name: 'Cozy Clean Guest Room - Family Apt',
  //     neighbourhood: 'Upper West Side',      
  //     room_type: 'Private room',
  //     accommodates: 1,
  //     price: '$79.00',
  //     rating: 3,
  //   },
  //   {
  //     key: '3',
  //     listing_id: 5441,
  //     picture_url: 'https://a0.muscache.com/im/pictures/13549/81a0927c_original.jpg?aki_policy=large',
  //     name: 'Central Manhattan/near Broadway',
  //     neighbourhood: 'Manhattan',      
  //     room_type: 'Private room',
  //     accommodates: 2,
  //     price: '$99.00',
  //     rating: 5,
  //   },
  // ];

  function onChange(pagination, filters, sorter, extra) {
    console.log('params', pagination, filters, sorter, extra);
  }
  function roundHalf(num) {
    return Math.round(num*2)/2;
  }
class SVDContent extends React.Component {
  constructor() {
    super()
    this.state = {
        recommendationSVD: []
    };
    }
    componentDidMount() {
      const userID = JSON.parse(localStorage.getItem('user')).id;
      this.getAll(userID)
  }
  getAll = id => {
    getRecommendationSVD(id).then(data => {
      const recommendationSVD = data
      this.setState({recommendationSVD})
    })
  }
  
    render() {
        return ( <Content style={{ padding: '0 24px', minHeight: 280}}>
        <Table 
            scroll={{ x: 500 ,y: 400 }} 
            columns={columns} 
            dataSource={this.state.recommendationSVD}
            onChange={onChange} 
            title={() => 'Top 3 recommendations using SVD'}
            pagination={{ pageSize: 20 }}                
        /> </Content>  
        );
    }
}

export default SVDContent