const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Property = require('../models/Property');
const Image = require('../models/Image');
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
});
module.exports = router;