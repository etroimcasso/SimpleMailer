require('dotenv').config();
//Mongoose
const mongoose = require('mongoose')
//Subscriber schema
const Mailer = require('../models/Mailer')
const MailerResult = require('../models/MailerResult')

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
		/*
		var mailerResultsDocument = []
		for (var i = 0; i < mailerResults.length; i++) {
			const newResult = new MailerResult({
				recipient: mailerResults.recipient,
				error: (mailerResults[i].error !== null || mailerResults[i].error.length > 0)
			})
			mailerResultsDocument.concat(newResult)
		}
		*/

		

		console.log(`MAILER RESULTS object: ${mailerResults[0].recipient}`)
		var mailerResultsDocument = []
		for (var i = 0;  i < mailerResults.length; i++ ) {
			const result = mailerResults[i]
			const currentIndex = i
			MailerResult.create({
				recipient: result.recipient,
				error: (result.error !== null || result.error.length > 0)
			}, (error, item) => {
				if (error) console.log(`Could not add mailer results: ${error}`)
				else {
					//console.log("Adding mailerResult")
					mailerResultsDocument.push(item._id)
					if (currentIndex === (mailerResults.length - 1)) {
						createMailer(subject, bodyText, bodyHTML, mailerResultsDocument, callback)
					}
				}
			})
		}		

	}
}