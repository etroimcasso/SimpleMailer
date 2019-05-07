require('dotenv').config();
//Mongoose
const mongoose = require('mongoose')
//Subscriber schema
const Mailer = require('../models/Mailer')
const MailerResult = require('../models/MailerResult')

const MailerResultController = require('./MailerResultController')

const createMailer = (subject, bodyText, bodyHTML, mailerResultsArray, callback) => {
	Mailer.create({
		subject: subject,
		bodyText: bodyText,
		bodyHTML: bodyHTML,
		mailerResults: mailerResultsArray,
		sent_on: Date.now()
	},(error, item) => {
		if (error) {
			return callback(error, false) 
		}
		return callback(false, true)
	})
}

module.exports = {
	addMailer: (subject, bodyText, bodyHTML, mailerResults, callback) => {
		MailerResultController.addMailerResults(mailerResults, (error, mailerResultsDocument) => {
			createMailer(subject, bodyText, bodyHTML, mailerResultsDocument, callback)		
		})
	}
}	
