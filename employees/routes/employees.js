const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');

const { Employee , validateEmployee } = require('../models/employee');

  router.get('/' ,async (req, res) => {
    // res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    // res.setHeader('Access-Control-Allow-Credentials', true); // If needed

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

router.post('/' , auth, async (req, res) => {
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  // res.setHeader('Access-Control-Allow-Headers', 'auth_token');
    const {error} = validateEmployee(req.body);
    if (error) {
        // return res.send(joiError.error.details[0].message);
        return res.send(error.details[0].message)
        // validation.error.details.map(err => {
        //     return res.send(err.message)
        // })
    }
  const employee = new Employee(
    {
      name : req.body.name,
      username : req.body.username,
      email : req.body.email
    }
  );
 await employee.save();
      res.send(employee)
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

router.delete('/:id', [auth, admin], async (req, res) => {
    const findedEmployee = await Employee.findByIdAndRemove(req.params.id);
    if(!findedEmployee) {
      return  res.status(404).send(`ID ( ${req.params.id} ) didn't match any employee..! `)
    }

    res.send(findedEmployee);
});

module.exports = router;
