const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // تشفير الباسورد
const _ = require('lodash'); // بتساعدني ارجع بينات معينه مش كل حاجه عشان الهاكرز
const { User  } = require('../../user/models/user');
const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');


router.post('/', async (req, res) => {

    const {error} = validationAuth(req.body);
    if (error) {
        return res.status(404).send(error.details[0].message)
    }
   let user = await User.findOne({email: req.body.email})
   if (!user) {
    return res.status(404).send('Invalid Email or Password !');
   }

const checkPassword =  await bcrypt.compare(req.body.password, user.password);
if (!checkPassword) {
    return res.status(404).send('Invalid Email or Password !');
   }
   const token = user.generateTokens();
      res.send(token);
});

function validationAuth(req) {
    const schema = Joi.object(
        {
            email : Joi.string().min(3).required().email(),
            password : Joi.string().min(6).required()
        }
    )
    return schema.validate(req);

}
module.exports = router;
