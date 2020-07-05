import React, { Component } from 'react';
import {Container, Spinner, UncontrolledAlert, Input, InputGroup, InputGroupAddon, Button} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTimes, faHeart, faBookmark as fullBookMark, faHome  } from '@fortawesome/free-solid-svg-icons'
import {faHeart as regularHeart, faTrashAlt, faBookmark  } from '@fortawesome/free-regular-svg-icons'
import {Link, withRouter} from 'react-router-dom';
import {isAuthenticated } from '../helpers/index'
import DefaultPhoto from '../images/user-default.jpg'

import axios from 'axios';

class SinglePost extends Component {

    state = {
        post: {},
        loading: true,
        bookmarkMessage: "",
        unbookmarkMessage: "",
        comment: ""
    }
    
    componentDidMount() {
        const id = this.props.match.params.postId;
        axios.get(`/api/posts/post/${id}`)
            .then(res => {
                console.log(res.data)
                this.setState({post: res.data, loading: false})
            })
            .catch(err=> console.log(err))
    }

    handleDelete = (post) => {
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
                this.props.history.push('/home')

        }).catch(err => console.log(err))
    }
    }

    handleLike = (post) => {
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
            let afterPosts = this.state.post;
            afterPosts.likes.push(userId);
            this.setState({posts: afterPosts})
        }).catch(err => console.log(err))
    }

    handleUnlike = (post) => {
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
            let afterPosts = this.state.post;
            afterPosts = res.data;
            this.setState({post: afterPosts})
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

      handleCommentChange = (e) => {
        this.setState({comment: e.target.value})
    }

    handleCommentSubmit = (post) => {
        const userId = isAuthenticated().user._id
        const postId = post._id
        const token = isAuthenticated().token
        const comment = {text: this.state.comment}
        axios.put(`/api/posts/comment/post`, {comment,userId, postId}, {
            headers: {
                  Accept: "application/json",
                  Authorization: `Bearer ${token}`
            }
        }).then(res => {
            console.log(res.data)
            let commentAfter = this.state.comment;
            commentAfter = "";
            this.setState({comment: commentAfter})
            let afterPosts = this.state.post;
            afterPosts = res.data;
            this.setState({post: afterPosts})
        })
        .catch(err => console.log(err.response))
    }
    
    handleCommentDelete = (comment, post) => {
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
                  let afterPosts = this.state.post;
                  afterPosts = res.data
                  this.setState({post:afterPosts});
              })
              .catch(err => console.log(err))
        }
    }

    handleFlag = (post) => {
        const token = isAuthenticated().token;
        const userId = isAuthenticated().user._id;
        const postId = post._id;
        let beforeBookmark = this.state.bookmarkMessage;
        beforeBookmark = null;
        this.setState({bookmarkMessage: beforeBookmark});
        axios.put(`/api/posts/flag/post`, {postId, userId} , {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        }).then( res => {
            console.log(res.data);
            let afterPosts = this.state.post;
            afterPosts.flags.push(userId);
            let afterBookmark = this.state.bookmarkMessage;
            afterBookmark = "Post added to collection!"
            this.setState({posts: afterPosts, bookmarkMessage: afterBookmark})
        }).catch(err => console.log(err.response))
    }

    handleUnflag = (post, i) => {
        const token = isAuthenticated().token;
        const userId = isAuthenticated().user._id;
        const postId = post._id;
        let beforeUnbookmark = this.state.unbookmarkMessage;
        beforeUnbookmark = null;
        this.setState({unbookmarkMessage:beforeUnbookmark});
        axios.put(`/api/posts/unflag/post`, {postId, userId} , {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        }).then( res => {
            console.log(res.data.result);
            let afterPosts = this.state.posts;
            afterPosts = res.data.result;
            let afterUnbookmark = this.state.unbookmarkMessage;
            afterUnbookmark = "Post removed from collection!"
            this.setState({post: afterPosts, unbookmarkMessage: afterUnbookmark});
        }).catch(err => console.log(err.response))
    }


    render() {
        const {post, loading, bookmarkMessage, unbookmarkMessage, comment} = this.state

        return (
            <div className="container" style={{position:"relative"}}>
                {loading ? <Spinner style={{ width: '3rem', height: '3rem', position:"absolute", left:"45%", marginTop:"300px" }} color="primary" /> :
                 <Container style={{padding: "5rem"}}>
                    <Link to={'/home'}><FontAwesomeIcon icon={faHome}/></Link>
                    <div>
                        {post.photo ? 
                            <div style={{marginBottom: "3rem", border:"1px solid blue", padding: "2rem"}}>
                            {bookmarkMessage ? <UncontrolledAlert color="success">
                                    {bookmarkMessage}
                                </UncontrolledAlert> : <></>}
                            {unbookmarkMessage ? <UncontrolledAlert color="info">
                                {unbookmarkMessage}
                                </UncontrolledAlert> : <></>}
                            <div style={{position: "relative"}}>
                                <img src={`http://localhost:5000/api/users/${post.postedBy._id}/photo?${new Date().getTime()}`}
                                       style={{height:"30px", width:"30px", borderRadius:"50%"}}
                                        onError={i => (i.target.src = `${DefaultPhoto}`)}
                                    />
                                <Link to={`/user/${post.postedBy._id}`}><span style={{fontWeight:"bold"}}> {post.postedBy.name}</span></Link>
                                {isAuthenticated().user._id == post.postedBy._id ? <FontAwesomeIcon icon={faTimes} onClick={()=>this.handleDelete(post)} style={{position: "absolute" ,top:"0", right:"0", cursor:"pointer"}}/> : <></> }
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
                                }) ? <FontAwesomeIcon icon={faHeart} style={{color:"red", cursor:"pointer"}} onClick={()=>this.handleUnlike(post)} /> : <FontAwesomeIcon icon={regularHeart} style={{cursor:"pointer"}} onClick={() => this.handleLike(post)}/>}
                                <div style={{position:"absolute", right:"0", top:"0"}}>
                                    {post.flags.length == 0 ? <></> : <small style={{fontFamily:"Roboto"}}>{post.flags.length} people bookmark </small>}
                                    {post.flags.find((id) => {
                                        return id == isAuthenticated().user._id
                                    }) ? <FontAwesomeIcon icon={fullBookMark} onClick={() => this.handleUnflag(post)} style={{color:"rgb(251, 251, 18)", cursor:"pointer"}} /> : <FontAwesomeIcon icon={faBookmark} onClick={() => this.handleFlag(post)} style={{cursor:"pointer"}}/>}
                                </div>
                            </div>
                            {post.likes.length == 0 ? <></> : <div style={{marginTop: "0.5rem"}}>
                                    <span style={{fontWeight:"bold"}}>{post.likes.length}</span> like
                                </div>}
                            <div style={{marginTop:"0.5rem"}}>
                            {post.comments ? post.comments.map((comment,index) => {
                                return <div style={{position: "relative"}}> 
                                    <Link to={`/user/${comment.commentedBy._id}`}><span style={{fontWeight:"bold", color:"black", textDecoration:"none"}}>{comment.commentedBy.name} </span></Link>
                                    <span>{comment.text}</span>
                                    {comment.commentedBy._id == isAuthenticated().user._id ? 
                                        <div style={{position: "absolute", right:"0", top:"0"}}><FontAwesomeIcon icon={faTrashAlt} style={{cursor:"pointer"}} onClick={() => this.handleCommentDelete(comment, post)}/></div> 
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
                                <Input name="comment" value={comment} onChange={this.handleCommentChange}/>
                                <InputGroupAddon addonType="append">
                                <Button color="primary" onClick={()=>this.handleCommentSubmit(post)}>Comment</Button>
                                </InputGroupAddon>
                            </InputGroup>
                            </div>
                        </div>
                        :
                        <div style={{marginBottom: "3rem", border:"1px solid blue", padding: "2rem"}}>
                        {bookmarkMessage ? <UncontrolledAlert color="success">
                                {bookmarkMessage}
                            </UncontrolledAlert> : <></>}
                        {unbookmarkMessage ? <UncontrolledAlert color="info">
                            {unbookmarkMessage}
                            </UncontrolledAlert> : <></>}
                        <div style={{position: "relative"}}>
                            <img src={`http://localhost:5000/api/users/${post.postedBy._id}/photo?${new Date().getTime()}`}
                                        style={{height:"30px", width:"30px", borderRadius:"50%"}}
                                            onError={i => (i.target.src = `${DefaultPhoto}`)}
                                        />
                            <Link to={`/user/${post.postedBy._id}`}><span style={{fontWeight:"bold"}}> {post.postedBy.name}</span></Link>
                            {isAuthenticated().user._id == post.postedBy._id ? <FontAwesomeIcon icon={faTimes} onClick={()=>this.handleDelete(post)} style={{position: "absolute" ,top:"0", right:"0", cursor:"pointer"}}/> : <></> }
                        </div>
                        <div style={{marginTop: "1rem"}}>
                        {post.body}
                        </div>
                        <div style={{marginTop: "0.5rem"}}>
                        
                        </div>
                        <div style={{marginTop:"0.5rem", position:"relative"}}>
                            {post.likes.find((id) => {
                                return id == isAuthenticated().user._id
                            }) ? <FontAwesomeIcon icon={faHeart} style={{color:"red", cursor:"pointer"}} onClick={()=>this.handleUnlike(post)} /> : <FontAwesomeIcon icon={regularHeart} style={{cursor:"pointer"}} onClick={() => this.handleLike(post)}/>}
                            <div style={{position:"absolute", right:"0", top:"0"}}>
                                {post.flags.length == 0 ? <></> : <small style={{fontFamily:"Roboto"}}>{post.flags.length} people bookmark </small>}
                                {post.flags.find((id) => {
                                    return id == isAuthenticated().user._id
                                }) ? <FontAwesomeIcon icon={fullBookMark} onClick={() => this.handleUnflag(post)} style={{color:"rgb(251, 251, 18)", cursor:"pointer"}} /> : <FontAwesomeIcon icon={faBookmark} onClick={() => this.handleFlag(post)} style={{cursor:"pointer"}}/>}
                            </div>
                        </div>
                        {post.likes.length == 0 ? <></> : <div style={{marginTop: "0.5rem"}}>
                                <span style={{fontWeight:"bold"}}>{post.likes.length}</span> like
                            </div>}
                        <div style={{marginTop:"0.5rem"}}>
                        {post.comments ? post.comments.map((comment,index) => {
                            return <div style={{position: "relative"}}> 
                                <Link to={`/user/${comment.commentedBy._id}`}><span style={{fontWeight:"bold", color:"black", textDecoration:"none"}}>{comment.commentedBy.name} </span></Link>
                                <span>{comment.text}</span>
                                {comment.commentedBy._id == isAuthenticated().user._id ? 
                                    <div style={{position: "absolute", right:"0", top:"0"}}><FontAwesomeIcon icon={faTrashAlt} style={{cursor:"pointer"}} onClick={() => this.handleCommentDelete(comment, post)}/></div> 
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
                            <Input name="comment" value={comment} onChange={this.handleCommentChange}/>
                            <InputGroupAddon addonType="append">
                            <Button color="primary" onClick={()=>this.handleCommentSubmit(post)}>Comment</Button>
                            </InputGroupAddon>
                        </InputGroup>
                        </div>
                    </div>}
                    </div>
                </Container> }
            </div>
        );
    }
}

export default withRouter(SinglePost);