import React, { Component } from 'react';
import axios from 'axios';
import {isAuthenticated} from '../helpers/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome  } from '@fortawesome/free-solid-svg-icons'
import {Link} from 'react-router-dom';
import {Container, Row, Col, Spinner, UncontrolledAlert,Input,InputGroup,InputGroupAddon,Button } from 'reactstrap';
import {faTimes, faHeart, faBookmark as fullBookMark  } from '@fortawesome/free-solid-svg-icons'
import {faHeart as regularHeart, faTrashAlt, faBookmark  } from '@fortawesome/free-regular-svg-icons'
import DefaultPhoto from '../images/user-default.jpg'


class Bookmark extends Component {
    
    state = {
        posts: [],
        loading: true,
        deleteMessage: {},
        comment: [],
        unbookmarkMessage: ""
    }

    componentDidMount() {
        const id = isAuthenticated().user._id;
        axios.get(`/api/posts/flag/${id}`)
            .then(res => {
                console.log(res.data)
                this.setState({posts: res.data, loading: false})
            })
            .catch(err =>console.log(err))
    }

    handleDelete = (post, i) => {
        const token = isAuthenticated().token;
        let answer = window.confirm("You sure to delete post? xd")
        if (answer) {
            axios.delete(`/api/posts/delete/${post._id}`, {
                headers: {
                    Accept: 'applicaton/json',
                    Authorization: `Bearer ${token}`
                }  
            })
            .then(response => {
                console.log(response.data)
                this.setState({deleteMessage: response.data})
                let postsLeft = this.state.posts;
                postsLeft.splice(i, 1);
                this.setState({posts: postsLeft})

        }).catch(err => console.log(err))
    }
    }

    handleLike = (post, i) => {
        const postId = post._id;
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token
        axios.put(`/api/posts/like/post`, {postId, userId} , {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        }).then( res => {
            console.log(res);
            let afterPosts = this.state.posts;
            afterPosts[i].likes.push(userId);
            this.setState({posts: afterPosts})
        }).catch(err => console.log(err))
    }

    handleUnlike = (post, i) => {
        const postId = post._id;
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token
        axios.put(`/api/posts/unlike/post`, {postId, userId} , {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        }).then( res => {
            console.log(res);
            let afterPosts = this.state.posts;
            afterPosts[i] = res.data;
            this.setState({posts: afterPosts})
        }).catch(err => console.log(err))
    }

     timeSince = (date) => {

        var seconds = Math.floor((new Date() - date) / 1000);
      
        var interval = Math.floor(seconds / 31536000);
      
        if (interval > 1) {
          return interval + " years ago";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
          return interval + " months ago";
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
          return interval + " days ago";
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
          return interval + " hours ago";
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
          return interval + " minutes ago";
        }
        return Math.floor(seconds) + " seconds ago";
      }

      handleCommentChange = (i,e) => {
        let commentAfter = this.state.comment;
        commentAfter[i] = e.target.value
        console.log(e.target.value)
        this.setState({comment: commentAfter})
    }

    handleCommentSubmit = (post, i) => {
        const userId = isAuthenticated().user._id
        const postId = post._id
        const token = isAuthenticated().token
        const comment = {text: this.state.comment[i]}
        axios.put(`/api/posts/comment/post`, {comment,userId, postId}, {
            headers: {
                  Accept: "application/json",
                  Authorization: `Bearer ${token}`
            }
        }).then(res => {
            console.log(res.data)
            let commentAfter = this.state.comment;
            commentAfter[i] = "";
            this.setState({comment: commentAfter})
            let afterPosts = this.state.posts;
            afterPosts[i] = res.data;
            this.setState({posts: afterPosts})
        })
        .catch(err => console.log(err.response))
    }
    
    handleCommentDelete = (comment, post,i) => {
        const token = isAuthenticated().token;
        const postId = post._id;
        let answer = window.confirm("You sure to delete comment? xd")
        if(answer) {
              axios.put('/api/posts/uncomment/post', {comment, postId} ,{
                  headers: {
                      Accept: "application/json",
                      Authorization: `Bearer ${token}`
                  }
              }).then(res => {
                  console.log(res)
                  let afterPosts = this.state.posts;
                  afterPosts[i] = res.data
                  this.setState({posts:afterPosts});
              })
              .catch(err => console.log(err))
        }
    }

    handleUnflag = (post, i) => {
        const token = isAuthenticated().token;
        const userId = isAuthenticated().user._id;
        const postId = post._id;
        this.setState({unbookmarkMessage: ""})
        let answer = window.confirm("You sure wanna remove it from collection? xd")
        if (answer) {
            axios.put(`/api/posts/unflag/post`, {postId, userId} , {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`
                }
            }).then( res => {
                console.log(res.data.result);
                let afterPosts = this.state.posts;
                afterPosts.splice(i, 1)
                this.setState({posts: afterPosts, unbookmarkMessage: "Post removed from collection!"});
            }).catch(err => console.log(err.response))
        }
        
    }

    render() {
        const {loading, posts, deleteMessage,comment, unbookmarkMessage} = this.state;
        const yourself = isAuthenticated().user._id;

        return (
            <div className="container">
            {loading ? <Spinner style={{ width: '3rem', height: '3rem' }} /> : 
                <Container>
                    <div style={{paddingLeft: "5rem", marginTop:"2rem", position:"relative"}}>
                    <Link to="/home"><FontAwesomeIcon icon={faHome}/></Link>
                    <div style={{position:"absolute", left:"38%"}}>
                        <h2>Collection posts</h2>
                    </div>    
                    </div>
                    <Col xs="12" style={{padding: "7rem"}}>
                    {deleteMessage.message ? <UncontrolledAlert color="info">
                                {deleteMessage.message}
                        </UncontrolledAlert> : <></> }
                            {unbookmarkMessage ? <UncontrolledAlert color="info">
                                {unbookmarkMessage}
                                </UncontrolledAlert> : <></>}
                            {posts.map((post, i) => {
                                if (post.photo) {
                                    return (
                                    <div style={{marginBottom: "3rem", border:"1px solid blue", padding: "2rem"}}>
                                        <div style={{position: "relative"}}>
                                            <img src={`http://localhost:5000/api/users/${post.postedBy._id}/photo?${new Date().getTime()}`}
                                                   style={{height:"30px", width:"30px", borderRadius:"50%"}}
                                                    onError={i => (i.target.src = `${DefaultPhoto}`)}
                                                />
                                            <span style={{fontWeight:"bold"}}> {post.postedBy.name}</span>
                                            {yourself == post.postedBy._id ? <FontAwesomeIcon icon={faTimes} style={{position: "absolute" ,top:"0", right:"0", cursor:"pointer"}} onClick={() => this.handleDelete(post, i)}/> : <></> }
                                            
                                        </div>
                                        <div style={{marginTop: "1rem"}}>
                                        {post.body}
                                        </div>
                                        <div style={{marginTop: "0.5rem"}}>
                                        <img src={`http://localhost:5000/api/posts/${post._id}/photo?${new Date().getTime()}`} style={{ left: "0" , right:"0", width:"400px", height:"400px"}} />
                                        </div>
                                        <div style={{marginTop:"0.5rem", position:"relative"}}>
                                            {post.likes.find((id) => {
                                                return id == isAuthenticated().user._id
                                            }) ? <FontAwesomeIcon icon={faHeart} style={{color:"red", cursor:"pointer"}} onClick={()=>this.handleUnlike(post, i)} /> : <FontAwesomeIcon icon={regularHeart} style={{cursor:"pointer"}} onClick={() => this.handleLike(post, i)}/>}
                                            <div style={{position:"absolute", right:"0", top:"0"}}>
                                                {post.flags.length == 0 ? <></> : <small style={{fontFamily:"Roboto"}}>{post.flags.length} people bookmark </small>}
                                                <FontAwesomeIcon icon={fullBookMark} onClick={() => this.handleUnflag(post,i)} style={{color:"rgb(251, 251, 18)", cursor:"pointer"}} />
                                            </div>
                                        </div>
                                        {post.likes.length == 0 ? <></> : <div style={{marginTop: "0.5rem"}}>
                                                <span style={{fontWeight:"bold"}}>{post.likes.length}</span> like
                                            </div>}
                                        <div style={{marginTop:"0.5rem"}}>
                                            {post.comments ? post.comments.map((comment,index) => {
                                                return <div style={{position:"relative"}}> 
                                                    <Link to={`/user/${comment.commentedBy._id}`}><span style={{fontWeight:"bold", color:"black", textDecoration:"none"}}>{comment.commentedBy.name} </span></Link>
                                                    <span>{comment.text}</span>
                                                    {comment.commentedBy._id == isAuthenticated().user._id ? 
                                                    <div style={{position: "absolute", right:"0", top:"0"}}><FontAwesomeIcon icon={faTrashAlt} style={{cursor:"pointer"}} onClick={() => this.handleCommentDelete(comment, post,i)}/></div> 
                                                : <></> }
                                                </div>
                                            }) : <></> }
                                        </div>    
                                        <div style={{marginTop:"0.5rem"}}>
                                            <small>{this.timeSince(Date.parse(post.created))}</small>
                                        </div>
                                        <hr/>
                                        <div style={{marginTop:"0.5rem"}}>
                                        <InputGroup>
                                            <Input name="comment" value={comment[i]} onChange={(e) => this.handleCommentChange(i,e)}/>
                                            <InputGroupAddon addonType="append">
                                            <Button color="primary" onClick={()=>this.handleCommentSubmit(post,i)}>Comment</Button>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        </div>
                                    </div>
                                    ) 
                                } else {
                                    return (
                                        <div style={{marginBottom: "3rem", border:"1px solid blue", padding: "2rem"}}>
                                            <div style={{position: "relative"}}>
                                            <img src={`http://localhost:5000/api/users/${post.postedBy._id}/photo?${new Date().getTime()}`}
                                                   style={{height:"30px", width:"30px", borderRadius:"50%"}}
                                                    onError={i => (i.target.src = `${DefaultPhoto}`)}
                                                />
                                                <span style={{fontWeight:"bold"}}> {post.postedBy.name}</span>
                                                {yourself == post.postedBy._id ? <FontAwesomeIcon icon={faTimes} style={{position: "absolute" ,top:"0", right:"0",cursor:"pointer"}} onClick={() => this.handleDelete(post, i)}/> : <></> }
                                            </div>
                                            <div style={{marginTop: "1rem"}}>
                                            {post.body}
                                            </div>
                                            <div style={{marginTop:"0.5rem", position:"relative"}}>
                                            {post.likes.find((id) => {
                                                return isAuthenticated().user._id == id
                                            }) ? <FontAwesomeIcon icon={faHeart} style={{color:"red", cursor:"pointer"}} onClick={()=>this.handleUnlike(post, i)} /> : <FontAwesomeIcon icon={regularHeart} style={{cursor:"pointer"}} onClick={() => this.handleLike(post, i)}/>}
                                            <div style={{position:"absolute", right:"0", top:"0"}}>
                                                {post.flags.length == 0 ? <></> : <small style={{fontFamily:"Roboto"}}>{post.flags.length} people bookmark </small>}
                                                <FontAwesomeIcon icon={fullBookMark} onClick={() => this.handleUnflag(post,i)} style={{color:"rgb(251, 251, 18)", cursor:"pointer"}} />
                                            </div>
                                            </div>
                                            {post.likes.length == 0 ? <></> : <div style={{marginTop: "0.5rem"}}>
                                                <span style={{fontWeight:"bold"}}>{post.likes.length}</span> like
                                            </div>}
                                            <div style={{marginTop:"0.5rem"}}>
                                                {post.comments ? post.comments.map((comment,index) => {
                                                    return <div style={{position:"relative"}}> 
                                                        <Link to={`/user/${comment.commentedBy._id}`}><span style={{fontWeight:"bold", color:"black", textDecoration:"none"}}>{comment.commentedBy.name} </span></Link>
                                                        <span>{comment.text}</span>
                                                        {comment.commentedBy._id == isAuthenticated().user._id ? 
                                                    <div style={{position: "absolute", right:"0", top:"0"}}><FontAwesomeIcon icon={faTrashAlt} style={{cursor:"pointer"}} onClick={() => this.handleCommentDelete(comment, post,i)}/></div> 
                                                : <></> }
                                                    </div>
                                                }) : <></> }
                                            </div>
                                            <div style={{marginTop:"0.5rem"}}>
                                                <small>{this.timeSince(Date.parse(post.created))}</small>
                                            </div>
                                            <hr/>
                                            <div style={{marginTop:"0.5rem"}}>
                                            <InputGroup>
                                                <Input name="comment" value={comment[i]} onChange={(e) => this.handleCommentChange(i,e)}/>
                                                <InputGroupAddon addonType="append">
                                                <Button color="primary" onClick={()=>this.handleCommentSubmit(post,i)}>Comment</Button>
                                                </InputGroupAddon>
                                            </InputGroup>
                                            </div>
                                            
                                        </div>
                                                
                                              
                                    )
                                }
                            })}
                            
                        
                    </Col>
                </Container>
            }
                
            </div>
        );
    }
}

export default Bookmark;