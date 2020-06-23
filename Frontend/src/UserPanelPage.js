import React from 'react';
import './App.css';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Layout, Menu } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import Background from './img/NYCBackground.jpg'
import {Link, Switch} from 'react-router-dom';
import HotelsPage from './HotelsPage';
import RecommendationPage from './RecommendationPage';
import DashboardPage from './DashboardPage';
import SignIn from './SignIn';
import {BrowserRouter as Router, Route} from 'react-router-dom';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

class UserPanelPage extends React.Component {
  _refreshPage() {
    console.log("Logout");
    window.location.reload();
    localStorage.clear()
  }
    render() {
        return (   
          <Router>         
            <Layout style={{ minHeight: '100vh', backgroundImage: `url(${Background})`, backgroundSize: 'cover'}}>
            <Header className="header">
              <div className="logo" >
                  <p>NYC Hotel Advisor</p>
                  </div>
              <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                <Menu.Item key="1">     
                <Link to="/userPanel" >          
                    Hotels
                    </Link>
                    </Menu.Item>
                <Menu.Item key="2">
                <Link to="/userPanel/recommendation" >  
                  Your recommendation
                  </Link></Menu.Item>
                <Menu.Item key="3">
                <Link to="/userPanel/dashboard" > 
                Dashboard
                </Link></Menu.Item>
                <Menu.Item key="4" onClick={this._refreshPage}>
                <Link to="/" >
                  Logout
                  </Link></Menu.Item>
              </Menu>
            </Header>
            <Content style={{padding: '50px' , width: '80%' ,margin:'auto'}}>
                <div>
                <h1 className="title-text-user">
                 Welcome To NYC Hotel Advisor
                </h1> 
                    </div>     
                    <Switch style={{background: "darkgray"}}>
                    <Route path="/userPanel/recommendation" component={RecommendationPage}/>
                    <Route path="/userPanel/dashboard" component={DashboardPage}/>
                    <Route path="/userPanel" component={HotelsPage}/>
                  
                    </Switch>
                            
              
            </Content>
            <Footer style={{ textAlign: 'center', background: "darkgray", position: "sticky", bottom: "0", height:'5vh' }}>  <p className="footer-text">Hotel Recommendation System 2020 Created by Monika Jaroch</p></Footer>
          </Layout>    
        
          </Router>       
            );
        }
    }
    
    //const SignInForm = Form.create()(SignIn)
    export default UserPanelPage;