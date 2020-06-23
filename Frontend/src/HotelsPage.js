import React from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Layout, Menu , Form} from 'antd';
import {Link} from 'react-router-dom';
import HotelListsContent from './HotelListsContent'
import { Switch, Route} from 'react-router-dom';
import RecentlyVisited from './RecentlyVisited';
import WaitingToReview from './WaitingToReview';

const { Header, Content, Footer, Sider } = Layout;

class HotelsPage extends React.Component {

  
    render() {
       
        return ( 
            
            <Layout className="site-layout-background" style={{ padding: '60px 0',background: '#fff'}}>
                <Sider className="site-layout-background" width={200}>
                  <Menu
                    mode="inline"
                    // defaultSelectedKeys={['1']}                    
                    style={{ height: '100%' }}
                  >                    
                      <Menu.Item key="1"><Link to="/userPanel">Recently visited</Link></Menu.Item>   
                      <Menu.Item key="2"><Link to="/userPanel/hotelsList"> Hotels list </Link></Menu.Item>
                      <Menu.Item key="3"><Link to="/userPanel/waitingToReview">Waiting for review</Link></Menu.Item>                
                    
                  </Menu>
                </Sider>
                <Switch>
                    <Route path="/userPanel/hotelsList" component={HotelListsContent}/>
                    <Route path="/userPanel/waitingToReview" component={WaitingToReview}/>
                    <Route path="/userPanel" component={RecentlyVisited}/>
                  
                    </Switch>
                
              </Layout>
            );
        }
    }

    export default HotelsPage;