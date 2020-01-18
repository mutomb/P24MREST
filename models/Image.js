const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const ImageSchema = new Schema({
	title: {
		type: String,
		required: true
	}
});

const Image = mongoose.model('image', ImageSchema);
module.exports = Image;