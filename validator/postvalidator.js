const validator = require('validator');
const { post } = require('../routes/post');

const postValidator = (post) => {
    let errors = {};
    let isValid = false;

    if(validator.isEmpty(post.body)) {
        errors.body = 'Body must not be empty'
        return {errors, isValid}
    }
    else {
        isValid = true;
        return {errors, isValid}
    }
}

module.exports = postValidator;