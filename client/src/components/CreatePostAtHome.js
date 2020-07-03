import React, { Component } from 'react';
import {Container, Row, Col, Spinner} from 'reactstrap';
import {withRouter} from 'react-router-dom';
import {isAuthenticated} from '../helpers/index';
import DefaultPhoto from '../images/user-default.jpg'
import axios from 'axios';

class CreatePostAtHome extends Component {
    state = {
        user: {},
        loading: true,
        hover: false,
    }

    componentDidMount() {
        const id = isAuthenticated().user._id;
        axios.get(`/api/users/${id}`)
            .then(response => {
                console.log(response.data)
                this.setState({user: response.data, loading: false })
        })
    }

    toggleStyle = () => {
        this.setState({hover: !this.state.hover})
    }

    render() {
        const {user, loading, hover} = this.state
        const photoURL = user.photo ? `http://localhost:5000/api/users/${user._id}/photo?${new Date().getTime()}` : DefaultPhoto
        let style;
        if (hover) {
            style = {
                borderBottomLeftRadius:"20px",
                borderBottomRightRadius:"20px",
                borderTopLeftRadius: "20px",
                borderTopRightRadius:"20px",
                backgroundColor:"rgb(144,144,144)",
                height:"3rem", marginTop:"30px", cursor:"pointer", padding:"50px;"
            }
        } else {
            style = {
                borderBottomLeftRadius:"20px",
                borderBottomRightRadius:"20px",
                borderTopLeftRadius: "20px",
                borderTopRightRadius:"20px",
                backgroundColor:"rgb(120,120,120)",
                height:"3rem", marginTop:"30px", cursor:"pointer", padding:"50px;"
            }
        }
        return (
            <div>
                {loading ? <Spinner type="grow" color="primary" /> : 
                    <Container>
                        <Row>
                            <Col xs="3">
                                <img src={photoURL} alt={user.name} style={{width:"100px", height:"100px", borderRadius:"50%"}}/>
                            </Col>
                            <Col xs="9">
                                <div style={style} onMouseEnter={this.toggleStyle} onMouseLeave={this.toggleStyle} onClick={()=>this.props.history.push('/create/post')} >
                                    <div style={{textAlign:"center"}}>
                                        <span style={{color: "white"}}>What's on your mind?</span>
                                    </div>
                                </div>  
                            </Col>
                        </Row>
                    </Container>                
                }
                
            </div>
        );
    }
}

export default withRouter(CreatePostAtHome);