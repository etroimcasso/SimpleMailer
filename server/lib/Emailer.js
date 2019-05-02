const nodemailer = require('nodemailer');

//Email configuration
const EmailConfig = require('../config/EmailerConfig.js');

//Create mail transporter
let transporter = nodemailer.createTransport(EmailConfig.SupportAccount)

const publicFunctions = {
	sendEmail: function(messageOptions , callback) {

		var message = {
			from: messageOptions.senderEmail,
			sender: messageOptions.senderName,
			to: messageOptions.receiverEmails,
			cc: messageOptions.ccReceivers,
			bcc: messageOptions.bccReceivers,
			subject: messageOptions.subject,
			text: messageOptions.messageText,
			html: messageOptions.html,
			attachments: messageOptions.attachments,
			replyTo: messageOptions.replyTo
		}

		transporter.sendMail(message, (error, info) => {
			if (error) {
				callback(error, null)
			} else {
				callback(null, info)
			}
		})

	},

	//Verifies that the connection is working.
	// callback(error, success)
	testConnection: function(callback) {
		transporter.verify(function(error, success) {
			if (error) {
				callback(error, null);
			} else {
				callback(null, true);
			}
		})
	}

}

module.exports = publicFunctions;
