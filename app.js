//Requirements
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
mongoose.Promise = require('bluebird');
const config = require('./config/database.js');

//app config
const app = express();
const port = 8888;

//database connection string
mongoose.connect(config.database);

//database connection success
mongoose.connection.on('connected', () =>{
    console.log("Connected to database " + config.database);
});

//database connection success
mongoose.connection.on('error', (err) => {
  console.log("Database Error Occured : " + err);
});



//adding static directories
app.use(express.static(path.join(__dirname + 'public')));

//cross domain talk support
app.use(cors());

//json parser middleware
app.use(bodyParser.json());

//enable passport middlewate
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);


const users = require('./routes/users');
//add routes
app.use('/users',users);

//default route
app.get('/',(req,res) => {
  res.json({"api":"sliit his pharmacy module api v1.0.0"});
});


//start the server in a port specified above
app.listen(port, (err)=>{
  if(err){
    console.log("Error : " + err);
    return;
  }
    console.log("Server started running at " + port);
});
