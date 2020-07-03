import React, { Component } from 'react';
import {isAuthenticated} from '../helpers/index';
import {ListGroup, ListGroupItem, Spinner, UncontrolledAlert} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPlus } from '@fortawesome/free-solid-svg-icons'
import {Link} from 'react-router-dom';
import DefaultPhoto from '../images/user-default.jpg'
import axios from 'axios';
 

class SuggestFollow extends Component {

    state = {
        usersToFollow: [],
        loading: true,
        message: "",
    }

    componentDidMount() {
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token
        axios.get(`/api/users/suggest/${userId}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            console.log(response.data)
            this.setState({usersToFollow: response.data, loading: false})
        })
        .catch(err => console.log(err))
    }

    handleFollow = (person, i) => {
        const userId = isAuthenticated().user._id;
        const followId = person._id;
        const token = isAuthenticated().token;
        axios.put('/api/users/follow', {userId, followId}, {
            headers: {
                Accept: 'applicaton/json',
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            console.log(res.data)
            let toFollow = this.state.usersToFollow;
            toFollow.splice(i,1);
            this.setState({
                usersToFollow: toFollow,
                message : `You have followed ${person.name}!`
            })
        })
        .catch(err => console.log(err))
    }
    
    

    render() {
        const {usersToFollow, loading, message} = this.state
        return (
            <div style={{position: "relative"}}>
                {message ? <UncontrolledAlert color="success">
                    {message}
                    </UncontrolledAlert> : 
                <></>}
                <h2>Who to follow?</h2>
                {loading ? <Spinner style={{ width: '3rem', height: '3rem',position:"absolute", left:"50%"}} type="grow" /> : 
                    <ListGroup>
                        {usersToFollow.map((user,i) => {
                            return <ListGroupItem style={{position: "relative"}}>
                                <Link to={`/user/${user._id}`}>
                                    <img src={`http://localhost:5000/api/users/${user._id}/photo?${new Date().getTime()}`}
                                                   style={{height:"20px", width:"20px", borderRadius:"50%"}}
                                                    onError={i => (i.target.src = `${DefaultPhoto}`)}
                                                />
                                    <span style={{fontWeight:"bold"}}> {user.name}</span>
                                </Link>
                                <FontAwesomeIcon icon={faPlus} style={{position: "absolute", right:"5%", top:"35%", cursor:"pointer"}} onClick={() => this.handleFollow(user,i)} />
                            </ListGroupItem>
                        })}
                    </ListGroup>
                }
            </div>
        );
    }
}

export default SuggestFollow;