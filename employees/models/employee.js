const Joi = require('joi');
const mongoose = require('mongoose');


const Employee = mongoose.model('Employee', new mongoose.Schema({
    name : {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 44
    },
    username :  {
      type: String,
      required: true,
    },
    email : {
      type: String,
    //  validate: function (email) {
    //     var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    //     return emailRegex.test(email.text); 
    //  }
    }
  }))
  

  
// to make validation can use joi package 
function validateEmployee(employee) {
    const schema = Joi.object(
        {
            name :Joi.string().min(3).max(15).required(),
            username : Joi.string().min(3).max(15).required(),
            email : Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        }
    )
    return schema.validate(employee);

}


exports.Employee = Employee;
exports.validateEmployee = validateEmployee;