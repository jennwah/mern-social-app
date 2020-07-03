import React, { Component } from 'react';
import {Link, withRouter} from 'react-router-dom';
import validator from 'validator';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
import { Button, Form, FormGroup, Label, Input, FormText, FormFeedback } from 'reactstrap';
class Register extends Component {

    state = {
        name: "",
        email: "",
        password: "",
        errors: {}
    }

    onChange = (event) => {
        this.setState({ errors: {}});
        this.setState({ [event.target.name] : event.target.value})
    }


    handleSubmit = (event) => {
        event.preventDefault();
        const {errors, isValid} = this.inputValidation(this.state)
        if ( errors && !isValid) {
            this.setState({errors})
        } else {
            const { name, email, password} = this.state
            let data = {
                name,
                email,
                password
            }
            
            axios.post('/api/auth/register', data)
            .then( response => {
                console.log(response.data);
                this.props.history.push('/login')
            })
            .catch(err => console.log(err))
        }
    }

    inputValidation = ({name , email, password}) => {
        let errors = {};
        let isValid = false;
        if (validator.isEmpty(name)) {
            errors.name = "Name field cannot be empty!";
            return {errors, isValid}
        }
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
        if (!validator.isLength(password, {min: 6, max: 20})){
            errors.password = "Read the rules noob xd";
            return {errors, isValid}
        }
        isValid = true;
        return {errors, isValid}
    }

    render() {
        const { name, email, password, errors} = this.state
        return (   
            <div className="container" style={{margin: "5rem auto", width: "50%", border: "2px solid grey", borderRadius:"5%", padding:"50px"}}>
                <div style={{textAlign:"center"}}>
                    <h2><FontAwesomeIcon icon={faCode} /> Register</h2>
                </div>
                <br/><br/>
                <Form onSubmit={this.handleSubmit}>
                <FormGroup>
                    <Label for="exampleName"><FontAwesomeIcon icon={faUser}/> Name</Label>
                    <Input type="text" name="name" id="exampleName" placeholder="Enter your preferred name" value={name} onChange={this.onChange} invalid={errors.name ? true : false}/>
                    <FormFeedback>{errors.name}</FormFeedback>
                </FormGroup>
                <FormGroup>
                    <Label for="exampleEmail"><FontAwesomeIcon icon={faEnvelope}/> Email</Label>
                    <Input type="email" name="email" id="exampleEmail" placeholder="Enter your email" value={email} onChange={this.onChange} invalid={errors.email ? true: false}/>
                    <FormFeedback>{errors.email}</FormFeedback>
                </FormGroup>
                <FormGroup>
                    <Label for="examplePassword"><FontAwesomeIcon icon={faLock}/> Password</Label>
                    <Input type="password" name="password" id="examplePassword" placeholder="Enter your password" value={password} onChange={this.onChange} invalid={errors.password? true:false}/>
                    <FormFeedback>{errors.password}</FormFeedback>
                    <FormText>Password must be between 6 to 20 characters.</FormText>
                </FormGroup>
                
                <Button outline color="primary" onClick={this.handleSubmit}>Register</Button>
                <p>Already register? Click <Link to="/login">here</Link> to login</p>
                </Form>
            </div>
            
        );
    }
}

export default withRouter(Register);