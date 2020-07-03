import React, { Component } from 'react';
import {Link, withRouter} from 'react-router-dom';
import validator from 'validator';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
import { Button, Form, FormGroup, Label, Input, FormText, FormFeedback, Alert, Spinner } from 'reactstrap';

class Login extends Component {

    state = {
        email: "",
        password: "",
        errors: {},
        errorfromserver: {},
        loading: false,
    }

    onChange = (event) => {
        this.setState({ errors: {}, errorfromserver: {}});
        this.setState({ [event.target.name] : event.target.value})
    }


    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({lodaing: true})
        const {errors, isValid} = this.inputValidation(this.state)
        if ( errors && !isValid) {
            this.setState({errors, loading: false})
        } else {
            const { email, password} = this.state
            let data = {
                email,
                password
            }
            axios.post('/api/auth/login', data)
            .then( response => {
                console.log(response.data);
                if (typeof window !== 'undefined') {
                    localStorage.setItem('jwt', JSON.stringify(response.data))
                }
                this.props.history.push('/home')
            })
            .catch(err => {
                console.log(err);
                const data = err.response.data;
                this.setState({errorfromserver:data, loading: false})
            })
        }
    }

    inputValidation = ({email, password}) => {
        let errors = {};
        let isValid = false;

        if (validator.isEmpty(email)) {
            errors.email = "Email field cannot be empty!";
            return {errors, isValid}
        }
        if (validator.isEmpty(password)) {
            errors.password = "Password field cannot be empty!";
            return {errors, isValid}
        }
        if (!validator.isEmail(email)) {
            errors.email = "Must be a valid email address!";
            return {errors, isValid}
        }
        isValid = true;
        return {errors, isValid}
    }

    render() {
        const { email, password, errors, errorfromserver, loading} = this.state

         return (   
            <div className="container" style={{margin: "5rem auto", width: "50%", border: "2px solid grey", borderRadius:"5%", padding:"50px"}}>
                <div style={{textAlign:"center"}}>
                    <h2><FontAwesomeIcon icon={faSignInAlt} /> Login</h2>
                </div>
                <br/><br/>
                {errorfromserver.error ? (<Alert color="danger">
                    {errorfromserver.error}
                </Alert>) : <></>}
                <Form onSubmit={this.handleSubmit}>
                <FormGroup>
                    <Label for="exampleEmail"><FontAwesomeIcon icon={faEnvelope}/> Email</Label>
                    <Input type="email" name="email" id="exampleEmail" placeholder="Enter your email" value={email} onChange={this.onChange} invalid={errors.email ? true: false}/>
                    <FormFeedback>{errors.email}</FormFeedback>
                </FormGroup>
                <FormGroup>
                    <Label for="examplePassword"><FontAwesomeIcon icon={faLock}/> Password</Label>
                    <Input type="password" name="password" id="examplePassword" placeholder="Enter your password" value={password} onChange={this.onChange} invalid={errors.password? true:false}/>
                    <FormFeedback>{errors.password}</FormFeedback>
                    <FormText>Do not share your password with anyone smartie.</FormText>
                </FormGroup>
                
                <Button outline color="primary" onClick={this.handleSubmit}>Login</Button> {loading ? (<Spinner size="sm" color="secondary" />) : <></>}
                <p>Not a user yet? Click <Link to="/register">here</Link> to register</p>
                </Form>
            </div>
            
        );
    }
}

export default withRouter(Login);