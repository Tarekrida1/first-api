const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  fullname : {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 44
  },
 
  email : {
    type: String,
    required: true,
    unique: true  
  },
   
  password : {
      type: String,
      required: true,
      minlength: 6
    },
    isAdmin: Boolean
});

 userSchema.methods.generateTokens =  function () {
const token = jwt.sign({_id:this._id, isAdmin: this.isAdmin}, 'jwt_token');

  return token
}
const User = mongoose.model('User', userSchema)
  

  
  function userValidation(employee) {
    const schema = Joi.object(
        {
            fullname :Joi.string().min(3).required(),
            email : Joi.string().min(3).required().email(),
            password : Joi.string().min(6).required()
        }
    )
    return schema.validate(employee);

}

exports.User = User;
exports.userValidation = userValidation;