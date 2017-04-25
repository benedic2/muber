const express = require('express');
const routes = require('./routes/routes');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

mongoose.Promise = global.Promise;

    const uristring =
    process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://heroku_fmdjkv07:sfg2sap@ds117821.mlab.com:17821/heroku_fmdjkv07' ||
    'mongodb://localhost/muber';

const theport = process.env.PORT || 3050;

if(process.env.NODE_ENV !=='test'){
    mongoose.connect(uristring, function (err, res) {
      if (err) {
      console.log ('ERROR connecting to: ' + uristring + '. ' + err);
      } else {
      console.log ('Succeeded connected to: ' + uristring);
      }
    });
}

app.use(bodyParser.json());
routes(app);

//error handling middleware
app.use((err,req,res,next)=>{
   res.status(422).send({error:err.message}); 
});

module.exports = app;