const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const fs = require('fs');
const fileType = require('file-type');
const User = require('../models/User');
const Property = require('../models/Property');
const Image = require('../models/Image');
const ImageHandler = require('./controllers/ImageHandler');


//Retrieve all properties API
router.get('/', function(req, res, next) {
	//get properties under user with _id=req.query
	User.findById(req.query.id, 'properties').then(function(properties) {	
		res.send(properties);
	}).catch(next);
});
//add new property API
router.post('/:id', function(req, res, next) {
	//add property to user with _id=req.params.id
	User.findById(req.params.id).then(function(user) 
		{if(user.properties.length<1){
			const newProperty = new Property(req.body);
			req.body.images.forEach(function(image, index) {
				const newImage = new Image(image);
				newProperty.images.push(newImage);
			})
			user.properties.push(newProperty);
			user.save().then(function(property) {
				res.send(property);
			}).catch(next);

		} else {
			const newProperty = new Property(req.body);
			user.properties.push(newProperty);
			user.save().then(function(property) {
				res.send(property);
			}).catch(next);

		}
	}).catch(next);
});
//update property API
router.put('/:id', function(req, res, next) {
	// edit user=req.params._id and property = req.body._id
	User.findById(req.params.id).then(function(user) {
		user.properties.forEach(function(property, index) {
			if(property._id.equals(req.body._id)) {
				let newProperty= Property(req.body);
				req.body.images.forEach(function(image){
					const newImage = new Image(image);
					newProperty.images.push(newImage);
				})
				user.properties[index] = newProperty;
			}
		});
		user.markModified('properties');
		user.save().then(function(user) {
			res.send(user);
		})
	}).catch(next);
});

router.delete('/:id', function(req, res, next) {
	//edit properties under user with _id=req.query
	User.findById(req.params.id).then(function(user) {

		user.properties.forEach(function(property, index) {
			if(property._id.equals(req.body._id)) {
				user.properties.splice(index, 1);
			}
		});
		user.markModified('properties');
		user.save().then(function(user) {
			res.send(user);
		})
	}).catch(next);
});

router.post('/images', function(req, res, next){
	ImageHandler(req, res, function(err) {
		if(err) {
			next(err);
		} else {
			let path = `/api/property/images/${req.file.filename}`;
			res.send({path: path});
		}
	})
});
router.get('/images/:filename', function(req, res, next) {
	let imagename = req.params.filename;
	let path = __dirname +'/../public/images/'+imagename;
	let image = fs.readFileSync(path);
	let mime = fileType.fromBuffer(image);
		console.log(mime)
	res.writeHead(200, {'Content-type': mime});
	res.end(image);
})
router.delete('/images/:filename', function(req, res, next) {
	let imagename = req.params.filename;
	let path = __dirname +'/../public/images/'+imagename;
	let image = fs.unlink(path, function(err){
		if(err) next(err);
		else {
			res.sendStatus(200);
		}	
	});
});

router.post('/image')

module.exports = router;