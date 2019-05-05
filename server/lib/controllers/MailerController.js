require('dotenv').config();
//Mongoose
const mongoose = require('mongoose')
//Subscriber schema
const Mailer = require('../models/Mailer')

module.exports = {
	addMailer: (subject, bodyText, bodyHTML, recipients, callback) => {
		Mailer.create({
			subject: subject,
			bodyText: bodyText,
			bodyHTML: bodyHTML,
			recipients: recipients,
			sent_on: Date.now()
		},(error, item) => {
			if (error) {
				return callback(error, false) 
			}
			return callback(false, true)
		})
	}
}