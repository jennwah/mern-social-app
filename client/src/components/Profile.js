import React, { Component } from 'react';
import { Spinner, Button } from 'reactstrap';
import {Link, withRouter} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faHome, faCogs, faUserEdit, faTrashAlt, faArrowLeft} from '@fortawesome/free-solid-svg-icons'
import {isAuthenticated } from '../helpers/index';
import DefaultPhoto from '../images/user-default.jpg'
import PostsInProfile from './PostsInProfile';
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle, Row, Col, Container, ListGroup, ListGroupItem, Modal, ModalBody,ModalHeader,ModalFooter  } from 'reactstrap';
import axios from 'axios';

class Profile extends Component {
    state = {
        user: {},
        loading: true,
        following: false,
        followingModal: false,
        followerModal: false,
        posts: []
        
        
    }

    componentDidMount() {
        const id = this.props.match.params.userId;
        this.getData(id)
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.match.params.userId !== nextProps.match.params.userId) {
            window.location.reload(false);
        }
     }

    getData = (param) => {
        const id = param;
        axios.get(`/api/users/${id}`)
            .then(response => {
                console.log(response.data)
                let following = this.checkFollow(response.data)
                this.setState({user: response.data, loading: false, following })
        })
        axios.get(`/api/posts/${id}`)
            .then(res => {
                console.log(res.data)
                this.setState({posts: res.data, loading: false})
            
            })
            .catch(err => console.log(err))
    }

    
    //check whether you have followed the user you are viewing to conditionally render follow or unfollow button
    checkFollow = (user) => {
        let yourself = isAuthenticated().user;
        const match = user.followers.find(follower => {
            return follower._id === yourself._id
        })
        console.log(match)
        return match
    }

    //follow or unfollow functionalities
    handleFollowOrUnfollow = () => {
        const {following, user} = this.state;
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        const followId = user._id
        const unfollowId = user._id
        if (following) {
            //implement unfollow
            axios.put('/api/users/unfollow', {userId, unfollowId}, {
                headers: {
                    Accept: 'applicaton/json',
                    Authorization: `Bearer ${token}`
                }
            }).then(res => {
                console.log(res.data)
                this.setState({user: res.data})
                this.setState({following: !this.state.following})
            })
            .catch(err => console.log(err))
        } else {
            //implement follow
            axios.put('/api/users/follow', {userId, followId}, {
                headers: {
                    Accept: 'applicaton/json',
                    Authorization: `Bearer ${token}`
                }
            }).then(res => {
                console.log(res.data)
                this.setState({user: res.data})
                this.setState({following: !this.state.following})
            })
            .catch(err => console.log(err))
        }
    }
    
    handleDelete = () => {
        const id = this.props.match.params.userId;
        const token = isAuthenticated().token;
        let answer = window.confirm("You sure to delete account? xd")
        if (answer) {
            axios.delete(`/api/users/delete/${id}`, {
                headers: {
                    Accept: 'applicaton/json',
                    Authorization: `Bearer ${token}`
                }  
            })
            .then(response => {
                console.log(response)
                if (typeof window !== "undefined") localStorage.removeItem("jwt")
                axios.get('/api/auth/logout')
                    .then(response => {
                    console.log(response.data)
                    this.props.history.push('/register')
                    })
                    .catch(err => console.log(err))
            })
            .catch( err=> console.log(err))
        } 
    }

    toggleFollowingModal = () => {
        this.setState({followingModal: !this.state.followingModal})
    }
    toggleFollowerModal = () => {
        this.setState({followerModal: !this.state.followerModal})
    }
   
    render() {
        const { user, loading, following, followingModal,followerModal, posts} = this.state;
        const photoURL = user.photo ? `http://localhost:5000/api/users/${user._id}/photo?${new Date().getTime()}` : DefaultPhoto

        return loading ? <Spinner style={{ width: '5rem', height: '5rem', left:"45%", top:"45%", position: "absolute" }} /> : (
            <div className="container" style={{margin: "5rem auto", position:"relative"}} >
                <Link to="/home"><FontAwesomeIcon icon={faHome}/></Link>
                <div style={{textAlign: "center", marginBottom:"3rem"}}>
                    <img src={photoURL} alt={user.name} style={{width: "200px", height:"200px", borderRadius:"50%"}}/>
                    <br/>
                    <span style={{fontWeight:"bold", fontSize:"2rem"}}>{user.name}</span> 
                </div>
                <div style={{position: "absolute", right:"0", top:"0"}}>
                    {isAuthenticated() && isAuthenticated().user._id === user._id ? <UncontrolledButtonDropdown>
                        <DropdownToggle caret color="primary">
                            <FontAwesomeIcon icon={faCogs}/> Settings
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem header>{user.name}'s Profile</DropdownItem>
                            <DropdownItem><FontAwesomeIcon icon={faUserEdit}/><Link to={`/user/edit/${user._id}`}> <span style={{color:"black"}}>Edit</span></Link></DropdownItem>
                            <DropdownItem onClick={this.handleDelete}><FontAwesomeIcon icon={faTrashAlt}/> Delete Profile</DropdownItem>
                        </DropdownMenu>
                    </UncontrolledButtonDropdown> : <></>}
                </div>
                <Container>
                    <Row>
                        <Col><p onClick={this.toggleFollowerModal} style={{textAlign:"center", cursor:"pointer"}}><span style={{fontWeight:"bold"}}>{user.followers.length}</span> Followers</p></Col>
                        <Col><p onClick={this.toggleFollowingModal} style={{textAlign:"center",cursor:"pointer"}}><span style={{fontWeight:"bold"}}>{user.following.length}</span> Following</p></Col>
                        <Col><p style={{textAlign:"center"}}><span style={{fontWeight:"bold"}}>{posts.length}</span> posts</p></Col>
                    </Row>
                </Container>
                {isAuthenticated() && isAuthenticated().user._id === user._id ? 
                    <></>
             : <Button color="primary" size="sm" block onClick={this.handleFollowOrUnfollow}>
                 {following ? "Unfollow" : "Follow"}
            </Button>
            }
            <div style={{padding: "6rem"}}>
                <div>
                    <PostsInProfile user={user}/>
                </div>
            </div>
            


            <Modal isOpen={followingModal} toggle={this.toggleFollowingModal}>
                <ModalHeader>Following</ModalHeader>
                <ModalBody>
                    {user.following.length == 0 ? <p style={{fontWeight:"bold"}}>No users following</p> : 
                        <ListGroup>
                            {user.following.map((followinguser) => {
                                return <ListGroupItem>
                                                <img src={`http://localhost:5000/api/users/${followinguser._id}/photo?${new Date().getTime()}`}
                                                    style={{height:"20px", width:"20px", borderRadius:"50%"}}
                                                    onError={i => (i.target.src = `${DefaultPhoto}`)}
                                                />
                                                <span style={{fontWeight:"bold"}}>{followinguser.name}</span>
                                        </ListGroupItem>
                            })}
                        </ListGroup>
                    }
                </ModalBody>
                <ModalFooter>
                <Button color="secondary" onClick={this.toggleFollowingModal}><FontAwesomeIcon icon={faArrowLeft}/></Button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={followerModal} toggle={this.toggleFollowerModal}>
                <ModalHeader>Following</ModalHeader>
                <ModalBody>
                    {user.followers.length == 0 ? <p style={{fontWeight:"bold"}}>No followers :(</p> : 
                        <ListGroup>
                            {user.followers.map((follower) => {
                                return <ListGroupItem>
                                    <img src={`http://localhost:5000/api/users/${follower._id}/photo?${new Date().getTime()}`}
                                                    style={{height:"20px", width:"20px", borderRadius:"50%"}}
                                                    onError={i => (i.target.src = `${DefaultPhoto}`)}
                                                />
                                    <span style={{fontWeight:"bold"}}>{follower.name}</span>
                                </ListGroupItem>
                            })}
                        </ListGroup>
                    }
                </ModalBody>
                <ModalFooter>
                <Button color="secondary" onClick={this.toggleFollowerModal}><FontAwesomeIcon icon={faArrowLeft}/></Button>
                </ModalFooter>
            </Modal>
            </div>
        );
    }
}


export default withRouter(Profile);