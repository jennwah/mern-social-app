const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = Schema;

const postSchema = new Schema({
    body: {
        type: String,
        required: true,
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    postedBy: {
        type: ObjectId,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now,
    },
    likes: [{ type: ObjectId, ref: "User"}],
    comments: [
        {
            text: String,
            created: {type: Date, default: Date.now},
            commentedBy: {type: ObjectId, ref: "User"}
        }
    ],
    flags: [{ type: ObjectId, ref: "User"}],
})

const Post = mongoose.model('Post', postSchema);

module.exports = Post;