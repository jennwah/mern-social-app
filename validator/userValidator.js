const validator = require('validator');

const userValidator = (user) => {
    let errors = {};
    let isValid = false;

    if (validator.isEmpty(user.name)) {
        errors.name = 'Name must not be empty'
        return {errors, isValid}
    }
    else if(validator.isEmpty(user.email)) {
        errors.email = 'Email must not be empty'
        return {errors, isValid}
    }
    else if (!validator.isEmail(user.email)) {
        errors.email = "Must be a valid email!"
        return {errors, isValid}
    }
    else if (validator.isEmpty(user.password)) {
        errors.password = "Password must not be empty!"
        return {errors, isValid}
    }
    else if (!validator.isLength(user.password, {min: 6, max:20})){
        errors.password = "Password must be between 6 to 20 characters!"
        return {errors, isValid}
    }
    else {
        isValid = true;
        return {errors, isValid}
    }   

}

module.exports = userValidator;