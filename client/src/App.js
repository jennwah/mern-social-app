import React from 'react';
import {BrowserRouter as Router, Route, BrowserRouter} from 'react-router-dom';
import './App.css';

import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import CreatePost from './components/CreatePost';
import Bookmark from './components/Bookmark';
import SinglePost from './components/SinglePost';

 
 function App(props) {
   return (
     <div>
       <Router>
         <Route exact path="/home" component={Home}/>
         <Route exact path="/login" component={Login}/>
         <Route exact path="/register" component={Register}/>
         <Route exact path="/user/:userId" component={Profile}/>
         <Route exact path="/user/edit/:userId" component={EditProfile}/>
         <Route exact path="/create/post" component={CreatePost}/>
         <Route exact path="/bookmark" component={Bookmark}/>
         <Route exact path="/post/:postId" component={SinglePost}/>
       </Router>
     </div>
   );
 }
 
 export default App;