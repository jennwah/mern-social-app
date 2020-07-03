const express = require('express');
const router = express.Router();
const _ = require('lodash');
const User = require('../models/User');
const { requireLoggedIn, hasAuthorization } = require('../middleware/auth');
const { has } = require('lodash');
const formidable = require('formidable');
const fs = require('fs');


//for any route containing :userId
router.param('userId', (req,res,next,id) => {
    User.findById(id)
    .populate('following', '_id name' )
    .populate('followers', '_id name' )
    .select('_id name email following followers created photo updated flaggedposts')
    .exec( (err, user) => {
        if (err || !user ) { 
            return res.json({error: 'User not found!'})
        } else {
            req.profile = user //appends the user in req.profile
            next();
        }
    })
})

//to get all users
router.get('/', (req,res) => {
    User.find()
    .select('_id name email created')
    .then((users) => res.json(users))
    .catch(err => console.log(error))
})

//to get single user
router.get('/:userId', (req,res) => {
    return res.json(req.profile);
})

//update user
// router.put('/update/:userId', requireLoggedIn, hasAuthorization, (req,res) => {
//     let user = req.profile;
//     user = _.extend(user, req.body);
//     user.updated = Date.now();
//     user.save()
//     .then((user) => res.json(user))
//     .catch(err => console.log(error));
// })

//update user with photo upload functionality added
router.put('/update/:userId', requireLoggedIn, hasAuthorization, (req, res) => {
    let form = new formidable.IncomingForm();
    // console.log("incoming form data: ", form);
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Photo could not be uploaded'
            });
        }
        // save user
        let user = req.profile;
        // console.log("user in update: ", user);
        user = _.extend(user, fields);

        user.updated = Date.now();
        // console.log("USER FORM DATA UPDATE: ", user);

        if (files.photo) {
            user.photo.data = fs.readFileSync(files.photo.path);
            user.photo.contentType = files.photo.type;
        }

        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json({
                user,
                message: "Successful Update!"
            });
        });
    });
})    

//separate route to get user's profile photo
router.get('/:userId/photo', (req,res, next) => {
    if (req.profile.photo.data) {
        res.set(('Content-Type', req.profile.photo.contentType));
        return res.send(req.profile.photo.data);
    }
    next()
})


//delete user
router.delete('/delete/:userId', requireLoggedIn, hasAuthorization, (req,res) => {
    let user = req.profile;
    user.remove((err, user) => {
        if (err) {
            res.json({error: err})
        } else {
            res.json({message: 'User deleted!', user})
        }
    })
})

//follow user route (update following list and follower list of another)
router.put('/follow', requireLoggedIn, (req,res) => {
    User.findByIdAndUpdate(req.body.userId, { $push: { following: req.body.followId}}, (err,result) => {
        if(err) return res.status(400).json({error:err})
         else {
             User.findByIdAndUpdate( req.body.followId, {$push :{ followers : req.body.userId}}, {new:true} )
             .populate('following', '_id name')
             .populate('followers', '_id name')
             .exec( (err, result) => {
                if (err) return res.status(400).json({error: err})
                result.password = undefined;
                res.json(result);
             })
         }
    })
})

//unfollow user route (update following list and also follower list of another)
router.put('/unfollow', requireLoggedIn, (req,res) => {
    User.findByIdAndUpdate(req.body.userId, { $pull: { following: req.body.unfollowId}}, (err,result) => {
        if(err) return res.status(400).json({error:err})
         else {
             User.findByIdAndUpdate( req.body.unfollowId, {$pull :{ followers : req.body.userId}}, {new:true} )
             .populate('following', '_id name')
             .populate('followers', '_id name')
             .exec( (err, result) => {
                if (err) return res.status(400).json({error: err})
                result.password = undefined;
                res.json(result);
             })
         }
    })
})


//suggest users to follow (not including himself and users already following)
router.get('/suggest/:userId', requireLoggedIn, (req,res) => {
    let following = req.profile.following;
    following.push(req.profile._id)
    User.find({ _id: {$nin: following}}, (err,users) => {
        if (err) {
            return res.status(400).json({error: err})
        }
        res.json(users)
    })
})

module.exports = router;