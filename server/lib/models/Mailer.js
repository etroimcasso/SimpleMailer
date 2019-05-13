var mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
	subject: {
		type: String,
		required: true,
		unique: false,
		index: false
	},
	bodyText: {
		type: String,
		required: true,
		unique: false,
		index: false
	}, // Stored as  DraftJS EditorState
	bodyHTML: {
		type: String,
		required: true,
		unique: false,
		index: false
	},
	mailerResults: [Schema.Types.ObjectId],
	sent_on: {
		type: Date,
		required: true,
		index: true
	}
})

module.exports = mongoose.model('Mailer', schema);