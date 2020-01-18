const express = require('express');
const jwt  = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');

//user registetration API
router.post('/register', function(req, res, next) {
	User.create(req.body).then(function(createdUser) {
		res.send(createdUser);
	}).catch(next);
});
//user login API
router.post('/', function(req, res, next) {
	const { email, password } = req.body;
	console.log(password);
	User.findOne({email}).then(function(user) {
		if(!user){
			res.status(401).json({ error: 'Incorrect email or password' });
		}else{
			user.isCorrectPassword(password, function(err, same) { 
				if(err){
					next(err)
				} else if (!same) {
					res.status(401).json({ error: 'Incorrect email or password' });
				} else {
					const payload = { email };
					const secret = 'shhhh'
					const token = jwt.sign(payload, secret, {expiresIn: '1h'});
				    user.token = token;
				    user.save().then(function(loggedInUser) {
						res.cookie('token', token, { httpOnly: true }).status(200) //prevent XSS attackers and approve.
						   .send(loggedInUser);
				    })
				} 
			})
		}
	}).catch(next);
});
router.post('/logout', function(req, res, next) {
	User.findById(req.body._id).then(function(user) {
		if(!user){
			res.send({error: 'Cannot logout'})
		} else{
			user.token = '';
			user.save().then(function(loggedOutUser) {
				res.status(200).send(loggedOutUser);
			}).catch(next);
		}
	}).catch(next);
});

/* Update password not work properly
router.put('/:id', function(req, res, next) {
	User.findById(req.params.id).then(function(user) {
		const { password, username } = req.body;
		const saltRounds = 10;
		bcrypt.hash(password, saltRounds).then(function(hashedPassword) {
				user.password = hashedPassword;
				user.username = username;
				user.markModified('password')
				user.save().then(function(updatedUser) {
					res.send(updatedUser);
				}).catch(next);
		}).catch((next));
	}).catch(next);
});
*/
module.exports = router;