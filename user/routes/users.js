const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // تشفير الباسورد
const _ = require('lodash'); // بتساعدني ارجع بينات معينه مش كل حاجه عشان الهاكرز
const { User , userValidation } = require('../models/user');
const auth = require('../../middleware/auth');



  router.get('/profile',auth , async (req, res) => {
    const profile = await User.findById(req.user._id).select('-password')
      res.send(profile)
  });
  router.get('/', async (req, res) => {
    const employees = await Employee.find().sort('username')
      res.send(employees)
  });
 
  router.get('/:id', async (req, res) => {
     const findedEmployee = await Employee.findById(req.params.id)
     if(!findedEmployee) {
         res.status(404).send(`ID ( ${req.params.id} ) didn't match any employee..! `)
     }
    res.send(findedEmployee)
});

router.post('/', async (req, res) => {

    const {error} = userValidation(req.body);
    if (error) {
        // return res.send(joiError.error.details[0].message);
        return res.status(404).send(error.details[0].message)
        // validation.error.details.map(err => {
        //     return res.send(err.message)
        // })
    }
   let user = await User.findOne({email: req.body.email})
   if (user) {
    return res.status(404).send('this email already exists !');
   }
   user = new User( _.pick(req.body, ['fullname', 'email', 'password']) );
   const saltRounds = 10;
   const salt = await bcrypt.genSalt(saltRounds);
   user.password = await bcrypt.hash(user.password, salt);
   await user.save();
   const token = user.generateTokens();
   
      res.header('auth_token', token).send(_.pick(user , ['_id' , 'fullname', 'email'] ));
});

router.put('/:id', async (req, res) => {

    const {error} = validateEmployee(req.body);
    if (error) {
        // return res.send(joiError.error.details[0].message);
        return res.send(error.details[0].message)
        // validation.error.details.map(err => {
        //     return res.send(err.message)
        // })
    }
    
   const employee = await Employee.findByIdAndUpdate(req.params.id, {
    $set: {
      name : req.body.name,
      username : req.body.username,
      email : req.body.email

  }

   },{ new: true})
   if (!employee) {
    return res.status(404).send('invalid ID')
   
}
    res.send(employee);
});

router.delete('/:id', async (req, res) => {
    const findedEmployee = await Employee.findByIdAndRemove(req.params.id);
    if(!findedEmployee) {
      return  res.status(404).send(`ID ( ${req.params.id} ) didn't match any employee..! `)
    }

    res.send(findedEmployee);
});

module.exports = router;