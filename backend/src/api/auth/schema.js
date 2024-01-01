const yup = require('yup');

const signUp = {
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
};

const login = {
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
};

const getProfile = {
    authorization: yup.string().required(),
};

exports.signUpSchema = new yup.ObjectSchema(signUp);
exports.loginSchema = new yup.ObjectSchema(login);
exports.getProfileSchema = new yup.ObjectSchema(getProfile);