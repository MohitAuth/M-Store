const joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email : {type: String, required:true, unique: true},
    password: {type: String, required:true },
    picture : {type: String}
});

const User = mongoose.model("User", userSchema);

function validateUser(user) {
    const schema = {
        name: joi.string().required(),
        email: joi.string().required(),
        password: joi.string().required(),
        picture: joi.string()
    };
    return joi.validate(user,schema);
}

exports.User = User;
exports.validate = validateUser;
   