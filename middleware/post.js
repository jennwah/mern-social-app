const isPoster = (req, res, next) => {
    if (req.post && req.auth &&  req.post.postedBy._id == req.auth._id) {
        next();
    } else {
        return res.json({error: 'You are not authorized to edit or delete this post!'})
    }
}

module.exports = {isPoster};