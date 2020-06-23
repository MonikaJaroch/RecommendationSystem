import React, { Component } from 'react';
import './App.css';
import SignIn from './SignIn'
import HotelsPage from './HotelsPage'
import { render } from '@testing-library/react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import RecommendationPage from './RecommendationPage';
import DashboardPage from './DashboardPage';
import UserPanelPage from './UserPanelPage';

class App extends Component {

render() {
  return (
    <Router>
       <Switch> 
      <Route path="/userPanel" component={UserPanelPage}/>
      <Route path="/" component={SignIn}/>
      
     </Switch> 
    </Router>
    );
  }
}

export default App;
