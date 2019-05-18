require('dotenv').config();

const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('https');
const https = require('https');
const app = express();
const port = process.env.S_PORT;
const mongoose = require('mongoose')
const Emailer = require('./lib/Emailer')
const SubscriberController = require('./lib/controllers/SubscriberController')
const MailerController = require('./lib/controllers/MailerController')
const MailerResultController = require('./lib/controllers/MailerResultController')
const FileSystemController = require('./lib/controllers/FileSystemController')
const ServerStrings = require('./config/ServerStrings')

app.set('forceSSLOptions', {
  httpsPort: process.env.HTTPS_PORT
});

//Force SSL
var forceSsl = require('express-force-ssl');


const ssl_options = {
	httpsPort: process.env.HTTPS_PORT,
  	key: fs.readFileSync(path.join(__dirname,'../certs/server.key')),
  	cert: fs.readFileSync(path.join(__dirname,'../certs/server.crt')),
}
app.use(forceSsl)

const root = require('path').join(__dirname, '..', 'build')
const mailerContentRoot = require('path').join(__dirname, '..', 'mailerContent')
console.log(`MailerContent root: ${mailerContentRoot}`)
app.use(express.static(root));


//Route for mailer content
app.get("/mailerContent/:fileName", (req, res, next) => {
	 console.log(path.join(mailerContentRoot, 'mailerContent'))
	res.sendFile(path.join(mailerContentRoot, `${req.params.fileName}`))
})


//Route for everything else

app.get("*", (req, res) => {
	res.sendFile('index.html', { root })
})

const server = https.createServer(ssl_options, app);

const io = require('socket.io')(server);


http.createServer(app).listen(process.env.HTTP_PORT)
server.listen(process.env.HTTPS_PORT,() => {
	console.log(`Listening on port ${process.env.HTTPS_PORT}`)
})


//MongoDBURL Helper
const __MONGO_URI__ = require('./lib/helpers/MongoDBConnectionURI')
mongoose.connect(__MONGO_URI__, {useNewUrlParser: true, useCreateIndex: true });
const db = mongoose.connection

const sendEmail = (message, subscriberId, callback) => {
	const subscriberEmail = message.receiverEmails
	if (message.subject.length < 1 || message.messageText.length < 1) {
		//True signifies an error
		client.emit('sendEmailResults', true)
	} else {
		//Inject unsubscribe link into message before sending 
		Emailer.sendEmail(message, (error, info) => {
			var resultError = ""
			if (error) {
				console.error(`Could not send email - error: ${error}`)
				resultError = "Count not send email"
			} else {
				console.log(`Successfully sent email to ${subscriberEmail}`)
				resultError = false
			}
			callback(resultError)
		})
	}
}

const sendMailerEmail = (message, subscriberId, callback) => {
	var newMessage = message
	const subscriberEmail = message.receiverEmails
	if (message.subject.length < 1 || message.messageText.length < 1) {
		//True signifies an error
		client.emit('sendEmailResults', true)
	} else {

		Emailer.sendEmail(message, (error, info) => {
			var resultError = ""
			if (error) {
				console.error(`Could not send email - error: ${error}`)
				resultError = error
			} else {
				console.log(`Successfully sent email to ${subscriberEmail}`)
				resultError = false
			}
			callback(resultError, info)
		})
	}
}

//SOCKET SERVER
io.on('connection', (client) => {
	/*
	const subscribersCollection = db.collection('subscribers')
	const subscribersChanges = subscribersCollection.watch()

	subscribersChanges.on('change', (change) => {
			console.log(` Changes: ${change}`)
	})
	*/

	client.on('sendEmail', (message) => {
		console.log(`Sending mail to ${message.receiverEmails}`)
		const emailMessage = {
			senderName: message.senderName , 
			senderEmail: message.senderEmail,
			replyTo: message.replyTo,
			receiverEmails: message.receiverEmails,
			ccReceivers: message.ccReceivers,
			bccReceivers: message.bccReceivers,
			subject: message.subject,
			messageText: message.messageText,
			html: message.html,
			attachments: message.attachments
		}	
		sendEmail(emailMessage, (resultError) => {
			client.emit('sendEmailResults', resultError)
		})
	})
	client.on('sendMailer', (message) => {
		//Get all subscribers


		//1. Send process.env.EMAILER_MAXSEND # of emails
		//2. Wait process.env.EMAILER_WAITMS # of ms
		//3. return to 1. 
		//This above isn't needed thanks to nodemailer pooling. Maybe it will be needed in the future


		SubscriberController.getAllSubscribers((error, subscribers) => {
			var mailerResults = []
			if (subscribers.length < 1) {
				client.emit('sendEmailResults', "No subscribers")
			} else{
				for (var i = 0; i < subscribers.length; i++) {
					const currentIndex = i
					const subscriber = subscribers[i]

					const emailMessage = {
						senderName: process.env.EMAIL_USER, 
						senderEmail: process.env.EMAIL_USER,
						replyTo: process.env.EMAIL_USER,
						receiverEmails: subscriber.email,
						ccReceivers: null,
						bccReceivers: null,
						subject: message.subject,
						messageText: `${message.messageText} \n\n\n ${ServerStrings.UnsubScribePlainText(subscriber.email, subscriber._id)}`,
						html: `${message.html} ${ServerStrings.UnsubscribeHTML(subscriber.email, subscriber._id)}`,
						attachments: message.attachments
					}
					//console.log(`EMAIL MESSAGe ${emailMessage.messageText}`)
					sendMailerEmail(emailMessage, subscriber._id, (resultError) => {
						client.emit('mailerSendToSubscriberResult', resultError, subscriber.email)
						mailerResults = mailerResults.concat({recipient: subscriber.email, error: resultError})
						if (mailerResults.length === subscribers.length) {
							//finishMailer(emailMessage, mailerResults, message.messageText, message.html)
							client.emit('sendMailerFinished')
							console.log(`Sent Mailer: ${emailMessage.subject}`)
							MailerController.addMailer(emailMessage.subject, message.messageText, message.html, mailerResults, (error, mailer) => {
								if (error) console.error(`Could not add mailer to history: ${error}`)
								else {
									//console.log("mailerAddedToHistory")
									io.emit('mailerAddedToHistory', JSON.stringify(mailer))
								}
							})
						}	
					})				
				}
			}
		})
	})

	//Tests the email's connection
	//   returns false if successful, and an error message if there is an error
	client.on('testEmail', () => {
		Emailer.testConnection(function(error, success) {
			//console.log("attempt to verify smtp")
			var resultError = false
			if (error != null) {
				console.error('Cannot connect to SMTP server')
				resultError = "Cannot Connect to SMTP server"
			} else {
				if (success != null) {
					console.debug("Connection successful")
					resultError = false
				} else {
					console.debug("Something weird happened with an SMTP verify")
					resultError = "WHAT"
				}
			}
			client.emit('testEmailResults', resultError)
		})
	})

	client.on('getAllSubscribers', () => {
		SubscriberController.getAllSubscribers((error, subscribers) => {
			if (subscribers.length > 0) {
				client.emit('getAllSubscribersResult', error, JSON.stringify(subscribers))
			} else {
				io.emit('noSubscribers')
			}
		})
	})

	client.on('getSubscriberCount', () => {
		SubscriberController.getSubscriberCount((error, count) => {
			//console.log(`Subscribers Total: ${count}`)
		})
	})

	client.on('addSubscriber', (subscriberEmail ) => {
		// Add to thingy
		SubscriberController.addSubscriber(subscriberEmail, (error, item) => {
			subscriberEmail = subscriberEmail.toLowerCase()
			var resultError = false
			client.emit('subscriberAdded', error)
			if (error) {
				console.error(`ERROR ADDING SUBSCRIBER: ${error}`)
				resultError = error
			} 
			if (resultError == false) {
				const subscriber = item
				io.emit('newSubscriberAdded', JSON.stringify(subscriber))
				console.log(`NEW SUBSCRIBER: ${subscriber.email}`)
				const emailMessage = {
						senderName: process.env.EMAIL_USER, 
						senderEmail: process.env.EMAIL_USER,
						replyTo: process.env.EMAIL_USER,
						receiverEmails: subscriber.email,
						ccReceivers: null,
						bccReceivers: null,
						subject: ServerStrings.WelcomeSubscriberEmail.Subject(subscriber.email),
						messageText: ServerStrings.WelcomeSubscriberEmail.BodyText(subscriber.email,subscriber._id),
						html: null ,
						attachments: null
					}

				sendEmail(emailMessage,(error, info) => {
						var resultError = ""
						if (error) {
							console.error(`Could not send email - error: ${error}`)
							resultError = "Count not send email"
						} else {
							console.log("Successfully sent WelcomeSubscriberEmail email")
							resultError = false
						}
					})
			}
		})
	})

	client.on('removeSubscriber', (email, id) => {
		console.log(`UNSUBSCRIBE: ${email} ${id}`)

		if (id && email ) {
			const query = {
				_id: id,
				email: email
			}	
			SubscriberController.getOneSubscriberByQuery(query, (error, subscriber) => {
				if (error || !subscriber || subscriber.email == "" || !subscriber.email) {
					//console.error(`Can't remove subscriber because I'm a stupid computer: ${error} ${.email}`)
					client.emit('subscriberRemoved', error, null)
				}
				else {
					SubscriberController.removeSubscriber(subscriber, (error, item) => {
						if (error) client.emit('subscriberRemoved', error, null)
						else {
							console.log(`${email} has been unsubscribed`)
							io.emit('subscriberUnsubscribed', email)


							const emailMessage = {
									senderName: process.env.EMAIL_USER, 
									senderEmail: process.env.EMAIL_USER,
									replyTo: process.env.EMAIL_USER,
									receiverEmails: email,
									ccReceivers: null,
									bccReceivers: null,
									subject: ServerStrings.UnsubscribeEmail.Subject(email),
									messageText: ServerStrings.UnsubscribeEmail.BodyText(email),
									html: null ,
									attachments: null
								}

							sendEmail(emailMessage,(error, info) => {
									var resultError = ""
									if (error) {
										console.error(`Could not send email - error: ${error}`)
										resultError = "Count not send email"
									} else {
										//console.log("Successfully sent Unsubscribe alert email")
										resultError = false
									}
								})
							
						}
					})
				}
			})
		} else client.emit('subscriberRemoved', "WHAT", null)
	})


	//Emits 'loginResult', error, user object
	client.on('login', (username, password) => {

	})

	//Emits 'logoutResult'
	client.on('logout', (username) => {

	})

	//Emits 'getAllMailersResults' and 'noMailerResults'
	client.on('getAllMailers', () => {
		MailerController.getAllMailers((error, mailers) => {
			if (mailers.length > 0) {
				client.emit('getAllMailersResults', error, JSON.stringify(mailers))
			} else {
				io.emit('noMailers')
			}
		})
	})

	client.on('getAllMailerResults', () => {
		MailerResultController.getAllMailerResults((error, results) => {
			if (results.length > 0) {
				client.emit('getAllMailerResultsResults', error, JSON.stringify(results))
			} else {
				io.emit('noMailerResults')
			}
		})
	})

	client.on('getMailerContentFiles', (directory) => {
		/*
		FileSystemController.getFiles((error, files) => {
			if (error) client.emit('getMailerContentFilesResults', error, null)
			client.emit('getMailerContentFilesResults', null, files)
		})
		*/

		FileSystemController.getFiles(directory, (error, files) => {
			client.emit('getMailerContentFilesResults', error, files)
		})

		

	})
		
});

