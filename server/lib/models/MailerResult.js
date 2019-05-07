var mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
	recipient: {
		type: String,
		required: true,
		unique: false
	},
	error: {
		type: String,
		required: false,
		unique: false
	}
})

module.exports = mongoose.model('MailerResult', schema);