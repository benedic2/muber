const express = require('express');
const routes = require('./routes/routes');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

mongoose.Promise = global.Promise;

    const uristring =
    process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/muber';

if(process.env.NODE_ENV !=='test'){
    mongoose.connect(uristring, function (err, res) {
        if (err) {
            console.log('Error connecting to:' + uristring + '.' + err);
        } else {
            console.log('suceeded connected to:' uristring);
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