const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');
const {requireLoggedIn} = require('../middleware/auth');
const { isPoster} = require('../middleware/post');
const postValidator = require('../validator/postvalidator');
const Post = require('../models/Post');
const User = require('../models/User');

//for any route containing :userId
router.param('userId', (req,res,next,id) => {
    User.findById(id)
    .select('_id name email created photo flaggedposts')
    .exec( (err, user) => {
        if (err || !user ) { 
            return res.json({error: 'User not found!'})
        } else {
            req.profile = user //appends the user in req.profile
            next();
        }
    })
})

//for any route containing :postId
router.param('postId', (req,res,next,id) => {
    Post.findById(id)
    .populate('postedBy', '_id name photo')
    .populate('comments', 'text created')
    .populate('comments.commentedBy', '_id name')
    .exec( (err, post) => {
        if (err) {
            return res.json({error: err})
        } else {
            req.post = post //appends the post in req.post
            next();
        }
    })
})

//get all posts
router.get('/',  async (req,res)=> {
    // get current page from req.query or use default value of 1
    const currentPage = req.query.page;
    // return 3 posts per page
    const perPage = 3;
    let totalItems;

    const posts = await Post.find()
        // countDocuments() gives you total count of posts
        .countDocuments()
        .then(count => {
            totalItems = count;
            return Post.find()
                .skip((currentPage - 1) * perPage)
                .populate("comments", "text created")
                .populate("comments.commentedBy", "_id name")
                .populate("postedBy", "_id name")
                .sort({ "created": -1 })
                .limit(perPage)
        })
        .then(posts => {
            res.json({posts, totalItems})
        })
        .catch(err => console.log(err))
})

//implement like functionality for post
router.put('/like/post', requireLoggedIn, (req,res)=> {
    Post.findByIdAndUpdate(req.body.postId, {$push: {likes: req.body.userId}}, {new: true})
        .exec((err,result) => {
            if (err) {
                return res.status(400).json({ error: err})
            }
            else {
                res.json(result);
            }
        })
})

//implement unlike functionality for post
router.put('/unlike/post', requireLoggedIn, (req,res)=> {
    Post.findByIdAndUpdate(req.body.postId, {$pull: {likes: req.body.userId}}, {new: true})
        .populate("likes", "_id name email")
        .populate("postedBy", "_id name email photo")
        .populate('comments', 'text created')
        .populate('comments.commentedBy', '_id name')
        .exec((err,result) => {
            if (err) {
                return res.status(400).json({ error: err})
            }
            else {
                res.json(result);
            }
        })
})

//implement comment functionality on post
router.put('/comment/post', requireLoggedIn, (req,res)=> {
    let comment = req.body.comment;
    comment.commentedBy = req.body.userId;

    Post.findByIdAndUpdate(req.body.postId, {$push: {comments: comment }}, {new: true})
        .populate('comments.commentedBy', '_id name')
        .populate('postedBy', '_id name')
        .exec((err,result) => {
            if (err) {
                return res.status(400).json({ error: err})
            }
            else {
                res.json(result);
            }
        })

})

//implement delete comment functionality on post
router.put('/uncomment/post', requireLoggedIn, (req,res)=> {
    let comment = req.body.comment;

    Post.findByIdAndUpdate(req.body.postId, {$pull: {comments: {_id: comment._id} }}, {new: true})
        .populate('comments.commentedBy', '_id name')
        .populate('postedBy', '_id name')
        .exec((err,result) => {
            if (err) {
                return res.status(400).json({ error: err})
            }
            else {
                res.json(result);
            }
        })

})

//implement flag post functionality
router.put('/flag/post', requireLoggedIn, (req,res) => {
    Post.findByIdAndUpdate(req.body.postId, {$push: {flags: req.body.userId}}, {new: true})
        .then(result => {
            User.findByIdAndUpdate(req.body.userId, {$push: {flaggedposts: req.body.postId}}, {new: true})
            .then(result2 => {
                return res.json({
                    result,
                    result2
                })
            })
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
})

//implement unflag post functionality
router.put('/unflag/post', requireLoggedIn, (req,res) => {
    Post.findByIdAndUpdate(req.body.postId, {$pull: {flags: req.body.userId}}, {new: true})
        .populate("postedBy", "_id name email")
        .populate('comments', 'text created')
        .populate('comments.commentedBy', '_id name')
        .then(result => {
            User.findByIdAndUpdate(req.body.userId, {$pull: {flaggedposts: req.body.postId}}, {new: true})
            .then(result2 => {
                return res.json({
                    result,
                    result2
                })
            })
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
})


//create post 
router.post('/create/:userId', requireLoggedIn, (req,res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.json({error: err})
        }
        const { errors, isValid } = postValidator(fields);
        if ( errors && !isValid ) {
            return res.json(errors)
        } else {
            let post = new Post(fields);
            post.postedBy = req.profile;
            if (files.photo) {
                post.photo.data = fs.readFileSync(files.photo.path);
                post.photo.contentType = files.photo.type;
            }
            post.save((err, result) => {
                if (err) return res.json({error: err})
                res.json({
                    post
                });
            })
        }     
    })
})

//get all posts by that user
router.get('/:userId', (req,res) => {
    Post.find( {postedBy: req.profile })
    .populate('postedBy', '_id name email photo')
    .populate('comments', 'text created')
    .populate('comments.commentedBy', '_id name')
    .sort({"created": -1})
    .then((posts) => res.json(posts))
    .catch(err => console.log(error))

})

//get all posts flagged by that user
router.get('/flag/:userId', (req,res) => {
    let flaggedposts = req.profile.flaggedposts
    Post.find( {_id: {$in: flaggedposts}})
        .populate('postedBy', '_id name photo')
        .populate('comments', 'text created')
        .populate('comments.commentedBy', '_id name')
        .sort({"created": -1})
        .then((posts) => res.json(posts))
        .catch(err => console.log(err))
})

//update post
router.put('/update/:postId', requireLoggedIn, isPoster, (req,res) => {
    let post = req.post;
    post = _.extend(post, req.body);
    post.save()
    .then((post) => res.json(post))
    .catch(err => console.log(err))
})

//delete post
router.delete('/delete/:postId', requireLoggedIn, isPoster, (req,res) => {
    let post = req.post;
    post.remove((err, post) => {
        if (err) {
            return res.json({error: err})
        } else {
            res.json({message: 'Post deleted succesfully!'})
        }
    })
})

//to get a single post
router.get('/post/:postId', (req,res) => {
    return res.json(req.post)
})

//separate route to get post's photo
router.get('/:postId/photo', (req,res, next) => {
        res.set('Content-Type', req.post.photo.contentType);
        return res.send(req.post.photo.data);
})




module.exports = router;