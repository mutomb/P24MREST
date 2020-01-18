const express = require('express');
const UserRouter = require('./routes/AuthAPI');
const PropertyRouter = require('./routes/PropertyAPI');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//const locol_uri = 'mongodb://localhost:27017/property24';
const remote_uri = 'mongodb+srv://temp:temp@cluster0-j1vkj.mongodb.net/test?retryWrites=true&w=majority'
var db = mongoose.connect( remote_uri, {
	useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify:false
}, function(err) {
	if(err) throw err;
	console.log('connected to db');
})

//app-level middleware for static files routes
app.use(express.static('public'));

//app-level middleware for parsing HTTP message body entity
app.use(bodyParser.json());


//api router-level middlewares for routes
app.use('/api/user',UserRouter);
app.use('/api/property',PropertyRouter);

//error-handling middleware
app.use(function(err, req, res, next) {
	if(err) res.status(500).send({error: err.message}); 
});

app.listen(process.env.PORT || 3000, function(err){
	if(err) throw err;
	console.log(`Server listening: ${process.env.PORT || 3000}`);
});