import React from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Layout, Menu } from 'antd';
import {Link} from 'react-router-dom';
import { Switch, Route} from 'react-router-dom';
import Chart_1 from './Chart_1';
import Chart_2 from './Chart_2';
const { Header, Content, Footer, Sider } = Layout;

class DashboardPage extends React.Component {

    render() {
        return ( 
            <Layout className="site-layout-background" style={{ padding: '60px 0',background: '#fff'}}>
                <Sider className="site-layout-background" width={200}>
                  <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}                   
                    style={{ height: '100%' }}
                  >                    
                      <Menu.Item key="1"><Link to="/userPanel/dashboard">Room type</Link></Menu.Item>               
                      <Menu.Item key="2"><Link to="/userPanel/dashboard/neighbourhood">Neighbourhood</Link></Menu.Item>                                    
                              
                    
                  </Menu>
                </Sider>
                <Switch>
                    <Route path="/userPanel/dashboard/neighbourhood" component={Chart_2}/>
                    <Route path="/userPanel/dashboard" component={Chart_1}/>                  
               
                </Switch>
              </Layout>
            );
        }
    }
    
    //const SignInForm = Form.create()(SignIn)
    export default DashboardPage;