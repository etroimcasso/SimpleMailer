require('dotenv').config();
//Mongoose
const mongoose = require('mongoose')
//Subscriber schema
const MailerResult = require('../models/MailerResult')

module.exports = {
	addMailerResults: (mailerResults, callback) => {
		var mailerResultsDocument = []
		for (var i = 0;  i < mailerResults.length; i++ ) {
			const result = mailerResults[i]
			const currentIndex = i
			MailerResult.create({
				recipient: result.recipient,
				error: result.error
			}, (error, item) => {
				if (error) console.log(`Could not add mailer results: ${error}`)
				else {
					//console.log("Adding mailerResult")
					mailerResultsDocument.push(item._id)
					if (mailerResultsDocument.length === mailerResults.length) {
						callback(null, mailerResultsDocument)
					}
				}
			})
		}		

	},

	getAllMailerResults: (callback) => {
		MailerResult.find({}, (error, results) => {
			if (error) return (error, false)
			return callback(null, results)
		})
	},
}