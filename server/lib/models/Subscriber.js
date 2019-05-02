var mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
	name: {
		type: String,
		required: false,
		unique: false,
		trim: false
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},

	joined_on: { 
		type: Date, 
		required: true, 
		index: true 
	},
})

module.exports = mongoose.model('Subscriber', schema);