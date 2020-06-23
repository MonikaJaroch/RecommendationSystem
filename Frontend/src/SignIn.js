import React from 'react';
import './App.css';
import { Button, Form, } from 'react-bootstrap';
import {Link} from 'react-router-dom';

class SignIn extends React.Component {
   userID;
   constructor(props) {
    super(props);

    this.onChangeID = this.onChangeID.bind(this);    
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
        id: ''       
    }
    }
    onChangeID(e) {
        this.setState({ id: e.target.value })
    }
    onSubmit(e) {
        e.preventDefault()

        this.setState({
            id: ''
          
        })
    }
    
    componentWillUpdate(nextProps, nextState) {
        localStorage.setItem('user', JSON.stringify(nextState));
    }
    render() {
        return (
            <div className="App-header">
                <h1 className="title-text">
                 Welcome To NYC Hotel Advisor
                </h1>
                <p>We will recommend you the best hotel in town</p>
                <div className="form-group">   
                    <Form className="form" onSubmit={this.onSubmit}>
                        <Form.Group controlId="formBasicEmail" >
                            <Form.Label>Sign In</Form.Label>
                            <Form.Control type="email" placeholder="Enter your ID" value={this.state.id} onChange={this.onChangeID} />    
                        </Form.Group>
                        <Link to="/userPanel">
                            <Button variant="primary" type="submit" size="lg" className="button-log">
                                Submit
                            </Button>
                        </Link>
                    </Form>
                </div> 
            </div>
        );
    }
}

//const SignInForm = Form.create()(SignIn)
export default SignIn;