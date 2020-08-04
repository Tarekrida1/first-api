const express = require('express');
const compression = require('compression')
require('express-async-errors');
const app = express(); 
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const logger = require('./config/logger');
const employees = require('./employees/routes/employees');
const users = require('./user/routes/users');
const auth = require('./auth/routes/auth');



mongoose
  .connect("mongodb+srv://tarekrida:Tartare654321@cluster0.5z8um.mongodb.net/forlearing", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to mongo"))
  .catch((e) => console.error("failed to connect to mongo " + e));
mongoose.set('useCreateIndex', true);
/**
 * 
 لو عاوز اغير البيئه
 export NODE_ENV=production
 */
// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000');


  let allowedOrigins = ['http://127.0.0.1:8020', 'http://localhost:8020', 'http://127.0.0.1:9000', 'http://localhost:4200'];
  let origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,auth_token');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
if(app.get('env') === 'development') {
    // app.use(logger.log1);
    // app.use(logger.log2);
    app.use(helmet()); // بتحمي الhttp
    app.use(morgan('tiny')); // بتعمل log لكل حاجه
}
app.use(express.json()); // to convert any request to json // and this is a type of middlewre
app.use(compression());
app.get('/', (req, res) => {
    res.setHeader('content-type', 'text/html');

    res.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>first node js api</title>
    </head>
    <body>
        <h3>hello world from my first node js api</h3>
    <p>my api now Contains</p>
    <ol>
        <li>  <a href="/employees">Employees</a></li>
        <li>  <a href="/auth">Login</a></li>
        <li>  <a href="/users">Registration</a></li>
        <li>admin permissions rol : like delete employee</li>


    </ol>
    <table>
      <tbody>
        <tr>
          <td>GET</td>
          <td>
            <a href="/employees">/employees</a>
          </td>
        </tr>
        <tr>
            <td>POST</td>
            <td>
              <a href="/employees">/employees</a>
            </td>
          </tr>
          <tr>
            <td>DELETE</td>
            <td>
              <a href="/employees/1">/employees/1 ( admin only )</a>
            </td>
          </tr>
          <tr>
            <td>Registration ( POST )</td>
            <td>
              <a href="/users">/users</a>
            </td>
          </tr>
        
        <tr>
          <td>Login ( POST )</td>
          <td>
            <a href="/auth">/auth</a>
          </td>
        </tr>
      
      
        <tr>
            <td>User Profile ( GET )</td>
            <td>
              <a href="/users/profile">/User Profile</a>
            </td>
          </tr>
      
      </tbody>
    </table>
    
    </body>
    </html>

 
    `);
    res.end();
});
// app.get('/employees/:id', (req, res) => {
//     res.send(req.params.id);
// });
// app.get('/employees/:title/:desc', (req, res) => {
//     res.send(req.query); // used in filters
// });
app.use('/employees', employees);
app.use('/users', users);
app.use('/auth', auth);



const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> { logger.info(`app is listening on port ${PORT}`)})