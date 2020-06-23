import React from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Layout, Menu } from 'antd';
import {Link} from 'react-router-dom';
import { Switch, Route} from 'react-router-dom';
import ALSContent from './ALSContent'
import SVDContent from './SVDContent'
const { Header, Content, Footer, Sider } = Layout;


class RecommendationPage extends React.Component {

    render() {
        return ( 
            <Layout className="site-layout-background" style={{ padding: '60px 0',background: '#fff'}}>
                <Sider className="site-layout-background" width={200}>
                  <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}                    
                    style={{ height: '100%' }}
                  >                    
                      <Menu.Item key="1"><Link to="/userPanel/recommendation">SVD recommendation</Link></Menu.Item>               
                      <Menu.Item key="2"><Link to="/userPanel/recommendation/ALS">ALS recommendation</Link></Menu.Item>                                    
                    
                  </Menu>
                </Sider>
                <Switch>
                    <Route path="/userPanel/recommendation/ALS" component={ALSContent}/>                    
                    <Route path="/userPanel/recommendation" component={SVDContent}/>
                  
                </Switch>
                
              </Layout>
            );
        }
    }
    
    //const SignInForm = Form.create()(SignIn)
    export default RecommendationPage;