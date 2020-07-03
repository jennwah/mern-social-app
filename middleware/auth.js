const expressJwt = require('express-jwt');
const JWT_SECRET = require('../config/config').JWT_SECRET;

const requireLoggedIn = expressJwt({
    secret:JWT_SECRET,
    //expresJWT appends the verified user id on req.auth._id
    userProperty: 'auth'
})


const hasAuthorization = (req, res, next) => {
    if ( req.profile && req.auth && req.profile._id == req.auth._id) {
        next()
    } else {
        return res.json({error: 'User not authorized to perform this action!'})
    }   
}

module.exports = { requireLoggedIn, hasAuthorization};