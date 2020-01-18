const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Property = require('./Property');
const Schema = mongoose.Schema;
const Image = require('./Image');


/** user document*/
const UserSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true
	}, 
	password: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	properties: {
		type: [Property.Schema],
		required: false,
	},
	token:{
		type: String,
		required: false,
		default: '',
	},
    createdAt:{
        type: Date,
        default: Date.now
    }
})
//mongoose pre middleware or lifecycle hook called before saving. 
UserSchema.pre('save', function(next) {
	//this=document to be saved; check if new document or modidified document
	if(this.isNew || this.isModified) {
		const document = this; //saving object context
		const saltRounds = 10;
		bcrypt.hash(document.password, saltRounds, function(err, hashedPassword) {
			if(err) next(err);
			else {
				document.password = hashedPassword; 
				next();
			}
		});
	}
	else {
		next();
	}
});


//attach custom method to every document: user authentication
UserSchema.methods.isCorrectPassword = function (password, callback) {
	bcrypt.compare(password, this.password, function(err, same) { //this= document instance
		if(err) callback(err);
		else {
			callback(err, same);
		}
	});
}
// turn cleartext to encrypted
UserSchema.methods.hashPassword = function(password, callback) {
	const saltRounds = 10;
	bcrypt.hash(password, saltRounds, function(err, hashedPassword) {
		if(err) callback(err);
		else{
			callback(err, hashedPassword);
		}
	});	
}
/* users collection*/
const User = mongoose.model('user', UserSchema); //mongo drive pluralize name

module.exports = User;