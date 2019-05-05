require('dotenv').config();
var mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
	/*
	name: {
		type: String,
		required: false,
		unique: false,
		trim: false
	},
	*/
	[(process.env.MONGO_EMAIL_KEY || "email")]: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	/*
	joined_on: { 
		type: Date, 
		required: true, 
		index: true 
	},
	*/
})

module.exports = mongoose.model((process.env.MONGO_COLLECTION_NAME_SINGULAR || "Subscriber"), schema);