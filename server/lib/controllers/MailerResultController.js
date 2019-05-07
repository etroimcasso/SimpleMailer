require('dotenv').config();
//Mongoose
const mongoose = require('mongoose')
//Subscriber schema
const MailerResult = require('../models/MailerResult')

module.exports = {
	addMailerResults: (mailerResults, callback) => {
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

		

		//console.log(`MAILER RESULTS object: ${mailerResults[0].recipient}`)
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
					console.log("Adding mailerResult")
					mailerResultsDocument.push(item._id)
					if (mailerResultsDocument.length === mailerResults.length) {
						callback(null, mailerResultsDocument)
					}
				}
			})
		}		

	}
}