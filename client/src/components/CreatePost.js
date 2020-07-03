import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUser, faEnvelope, faEdit, faCamera, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Button, Form, FormGroup, Label, Input, FormFeedback, Alert, } from 'reactstrap';
import {isAuthenticated } from '../helpers/index';
import {withRouter, Link } from 'react-router-dom';
import axios from 'axios';
import validator from 'validator';



class CreatePost extends Component {

    state = {
        body: "",
        errors: {},
        user: {}
    
    }

    componentDidMount() {
        this.postData  = new FormData();
        this.setState({user: isAuthenticated().user})
    }

    onChange = name => (event) => {
        this.setState({errors: {}})
        const value = name === "photo" ? event.target.files[0] : event.target.value;
        this.postData.set(name, value);
        this.setState({ [name]: value });
    }

    handleSubmit= (event) => {
        event.preventDefault();
        const {errors , isValid } = this.inputValidation(this.state)
        const token = isAuthenticated().token;
        const id = this.state.user._id
        if ( errors && !isValid) {
            this.setState({errors})
        } else {
            axios.post(`/api/posts/create/${id}`, this.postData, {
                headers: {
                    Accept: 'applicaton/json',
                    Authorization: `Bearer ${token}`
                }   
            })
            .then( response => {
                console.log(response.data);
                this.props.history.push('/home');
            })
            .catch(err => console.log(err))
        }
    }


    inputValidation = ({body}) => {
        let errors = {};
        let isValid = false;
        if (validator.isEmpty(body)) {
            errors.body = "Body field cannot be empty!";
            return {errors, isValid}
        }
        isValid = true;
        return {errors, isValid}
    }

    

    render() {
        const {body, errors} = this.state
        return (
            <div className="container" style={{margin: "5rem auto", width: "50%", border: "2px solid grey", borderRadius:"5%", padding:"50px"}}>
                <Link to={`/home`}><FontAwesomeIcon icon={faArrowLeft}/></Link>
                <div style={{textAlign:"center"}}>
                    
                    <h2><FontAwesomeIcon icon={faEdit} /> Create Post</h2>
                    
                </div>
                <br/><br/>
                <Form onSubmit={this.handleSubmit}>
                <FormGroup>
                    <Label for="examplePhoto"><FontAwesomeIcon icon={faCamera}/> Upload a photo</Label>
                    <Input type="file" name="photo" id="examplePhoto" accept="image/*" onChange={this.onChange("photo")}/>
                </FormGroup>
                <FormGroup>
                    <Input type="textarea" name="body" id="exampleBody" placeholder="What's on your mind today?" value={body} onChange={this.onChange("body")} invalid={errors.body ? true : false}/>
                    <FormFeedback>{errors.body}</FormFeedback>
                </FormGroup>
                <Button outline color="primary" onClick={this.handleSubmit}>Submit post</Button>
                </Form>
            </div>
        );
    }
}

export default withRouter(CreatePost);