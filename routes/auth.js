const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const JWT_SECRET = require('../config/config').JWT_SECRET;
const router = express.Router();
const userValidator = require('../validator/userValidator');
const User = require('../models/User');


//register user
router.post('/register', (req,res) => {
    User.findOne({ email: req.body.email }).then((user) => {
        if(user) {
            return res.json('User with that email address already existed! Try another email!')
        }
        else {
            //validate user inputs
            const { errors, isValid } = userValidator(req.body);
            if ( errors && !isValid) {
                return res.json(errors)
            } else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                })
                //hash password and save into MongoDB database
                bcrypt.genSalt( 10, function(err, salt) {
                    bcrypt.hash(newUser.password, salt, function(err, hash) {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                        .then((user) => res.json(user))
                        .catch(err => console.log(err))
                    });
                });
            }
        }
    })
})


//log in user
router.post('/login', (req,res) => {
    User.findOne({ email: req.body.email }).then((user) => {
        if (!user) {
            return res.status(401).json({error: "User with that email address doesn't exists! Try again."})
        } else {
            //compare password
            const password = req.body.password;
            bcrypt.compare(password, user.password).then(isMatch => {
                if(!isMatch) {
                    return res.status(401).json({error: 'Incorrect password!'})
                } else {
                    //generate token with user id and secret
                    const token = jwt.sign({_id: user._id}, JWT_SECRET);
                    // persist the token as 't' in cookie with expiry date
                    res.cookie("t", token, {expire: new Date() + 9999})
                    //before returning, dont show the password
                    user.password = undefined;
                    // also return response with user and token to front end client
                    return res.json({ token, user})
                }
            })
        }
    })
})

//log out user
router.get('/logout', (req,res) => {
    res.clearCookie('t');
    return res.json({message: "successful logout!"})
})



module.exports = router;