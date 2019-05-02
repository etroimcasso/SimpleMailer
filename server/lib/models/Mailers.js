var mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
	subject: {},
	bodyText: {}
})

module.exports = mongoose.model('Mailers', schema);