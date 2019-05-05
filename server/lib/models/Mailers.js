var mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
	subject: {},
	bodyText: {} // Stored as  DraftJS EditorState
})

module.exports = mongoose.model('Mailers', schema);