import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUser, faEnvelope, faEdit, faCamera, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Button, Form, FormGroup, Label, Input, FormFeedback, Alert } from 'reactstrap';
import {isAuthenticated } from '../helpers/index';
import {withRouter, Link } from 'react-router-dom';
import axios from 'axios';
import validator from 'validator';
import DefaultPhoto from '../images/user-default.jpg'


class EditProfile extends Component {

    state = {
        name: "",
        email: "",
        loading: true,
        errors: {},
        updatedMessage: "",
        user: {}
    }

    componentDidMount() {
        this.userData  = new FormData();
        const id = this.props.match.params.userId;
        axios.get(`/api/users/${id}`)
            .then(response => {
                console.log(response.data)
                this.setState({
                    name: response.data.name,
                    email: response.data.email,
                    user: response.data
                 })
        })
        
    }

    onChange = name => (event) => {
        const value = name === "photo" ? event.target.files[0] : event.target.value;
        this.userData.set(name, value);
        this.setState({ [name]: value });
    }

    handleSubmit= (event) => {
        event.preventDefault();
        const {errors , isValid } = this.inputValidation(this.state)
       
        const id = this.props.match.params.userId;
        if ( errors && !isValid) {
            this.setState({errors})
        } else {
            const token = isAuthenticated().token;
            axios.put(`/api/users/update/${id}`, this.userData, {
                headers: {
                    Accept: 'applicaton/json',
                    Authorization: `Bearer ${token}`
                }   
            })
            .then( response => {
                console.log(response.data);
                this.setState({updatedMessage: response.data.message, updated:true})
            })
            .catch(err => console.log(err))
        }
    }


    inputValidation = ({name , email}) => {
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
        if (!validator.isEmail(email)) {
            errors.email = "Must be a valid email address!";
            return {errors, isValid}
        }
        isValid = true;
        return {errors, isValid}
    }

    

    render() {
        const {name, email, errors,updatedMessage,user} = this.state
        const id = this.props.match.params.userId;
        const photoURL = user.photo ? `http://localhost:5000/api/users/${id}/photo?${new Date().getTime()}` : DefaultPhoto

        return (
            <div className="container" style={{margin: "5rem auto", width: "50%", border: "2px solid grey", borderRadius:"5%", padding:"50px"}}>
                <Link to={`/user/${id}`}><FontAwesomeIcon icon={faArrowLeft}/></Link>
                <div style={{textAlign:"center"}}>
                    
                    <h2><FontAwesomeIcon icon={faEdit} /> Edit Profile</h2>
                    <img src={photoURL} alt={name} style={{height: "200px", width: "200px", borderRadius: "50%"}}/>
                    
                </div>
                <br/><br/>
                <Form onSubmit={this.handleSubmit}>
                {updatedMessage ? <Alert color="success">
                    {updatedMessage}
                </Alert> : <></>}
                <FormGroup>
                    <Label for="examplePhoto"><FontAwesomeIcon icon={faCamera}/> Profile photo</Label>
                    <Input type="file" name="photo" id="examplePhoto" accept="image/*" onChange={this.onChange("photo")}/>
                </FormGroup>
                <FormGroup>
                    <Label for="exampleName"><FontAwesomeIcon icon={faUser}/> Name</Label>
                    <Input type="text" name="name" id="exampleName" placeholder="Enter your preferred name" value={name} onChange={this.onChange("name")} invalid={errors.name ? true : false}/>
                    <FormFeedback>{errors.name}</FormFeedback>
                </FormGroup>
                <FormGroup>
                    <Label for="exampleEmail"><FontAwesomeIcon icon={faEnvelope}/> Email</Label>
                    <Input type="email" name="email" id="exampleEmail" placeholder="Enter your email" value={email} onChange={this.onChange("email")} invalid={errors.email ? true: false}/>
                    <FormFeedback>{errors.email}</FormFeedback>
                </FormGroup>
                <Button outline color="primary" onClick={this.handleSubmit}>Submit Changes</Button>
                </Form>
            </div>
        );
    }
}

export default withRouter(EditProfile);