const mongoose = require('mongoose');
const Image = require('./Image');
const Schema= mongoose.Schema;
const PropertySchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true
	},
	price: {
		type: String,
		required: true
	},
	images: {
		type: [Image.Schema],
		required: false,
	}
});

const Property = mongoose.model('Property', PropertySchema);
module.exports = Property;
