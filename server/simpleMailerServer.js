require('dotenv').config();

const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('https');
const https = require('https');
const app = express();
const port = process.env.S_PORT;

const Emailer = require('./lib/Emailer')
//const socketController = require('./lib/SocketController')
const SubscriberController = require('./lib/controllers/SubscriberController')
const MailerController = require('./lib/controllers/MailerController')
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


app.use(express.static(root));

//Route for mailer content
app.get("/mailerContent/:fileName", (req, res, next) => {
	res.sendFile(req.params.fileName, path.join(root, 'mailerContent/'))
})

//Route for everything else
app.get("*", (req, res) => {
   res.sendFile('index.html', { root });
})


const server = https.createServer(ssl_options, app);

const io = require('socket.io')(server);


http.createServer(app).listen(process.env.HTTP_PORT)
server.listen(process.env.HTTPS_PORT,() => {
	console.log(`Listening on port ${process.env.HTTPS_PORT}`)
})

const sendEmail = (message, callback) => {
	if (message.subject.length < 1 || message.messageText.length < 1) {
		//True signifies an error
		client.emit('sendEmailResults', true)
	} else {
		Emailer.sendEmail(message, (error, info) => {
			var resultError = ""
			if (error) {
				console.error(`Could not send email - error: ${error}`)
				resultError = "Count not send email"
			} else {
				console.log(`Successfully sent email to ${message.receiverEmails}`)
				resultError = false
			}
			callback(resultError)
		})
	}
}

//SOCKET SERVER
io.on('connection', (client) => {
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


		SubscriberController.getAllSubscribers((error, subscribers) => {
			var subscriberEmails = []
			if (subscribers.length < 1) {
				client.emit('sendEmailResults', "No subscribers")
			} else{
				for (var i = 0; i < subscribers.length; i++) {
					const subscriber = subscribers[i]
					//Construct message with subscriber as recipient
					//Only the messageText, html, attachments, receiver, and subject should be modifiable here
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
					sendEmail(emailMessage, (resultError) => {
						client.emit('mailerSendToSubscriberResult', resultError, subscriber.email)
					})					
					subscriberEmails = subscriberEmails.concat(subscriber.email)
				}
				client.emit('sendMailerFinished')
				MailerController.addMailer(message.subject, message.messageText, message.html, subscriberEmails, (error, result) => {
					if (error) console.error("Could not add mailer")
					else {

					}
				})
			}
		})
	})

	//Tests the email's connection
	//   returns false if successful, and an error message if there is an error
	client.on('testEmail', () => {
		Emailer.testConnection(function(error, success) {
			console.log("attempt to verify smtp")
			var resultError = false
			if (error != null) {
				console.debug('Cannot connect to SMTP server')
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
				client.emit('noSubscribers')
			}
		})
	})

	client.on('getSubscriberCount', () => {
		SubscriberController.getSubscriberCount((error, count) => {
			console.log(`Subscribers Total: ${count}`)
		})
	})

	client.on('addSubscriber', (subscriberEmail ) => {
		// Add to thingy
		SubscriberController.addSubscriber(subscriberEmail, (error, item) => {
			subscriberEmail = subscriberEmail.toLowerCase()
			var resultError = false
			client.emit('subscriberAdded', error)
			if (error) {
				console.log(`ERROR ADDING SUBSCRIBER: ${error}`)
				resultError = error
			} 
			if (resultError == false) {
				const subscriber = item
				io.emit('newSubscriberAdded', JSON.stringify(subscriber))
				console.log(`NEW SUBSCRIBER: ${subscriber.email}`)
				console.log(`Subscriber ID: ${subscriber._id}`)
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
		console.log(`Remove ${email} ${id}`)

		if (id && email ) {
			const query = {
				_id: id,
				email: email
			}	
			SubscriberController.getOneSubscriberByQuery(query, (error, subscriber) => {
				if (error || !subscriber || subscriber.email == "" || !subscriber.email) {
					console.error(`Can't remove subscriber because I'm a stupid computer: ${error} ${subscriber.email}`)
					client.emit('subscriberRemoved', error, null)
				}
				else {
					SubscriberController.removeSubscriber(subscriber, (error, item) => {
						if (error) client.emit('subscriberRemoved', error, null)
						else {
							console.log(`${email} has been unsubscribed`)
							client.emit('subscriberRemoved', null, JSON.stringify(item))
							io.emit('subscriberUnsubscribed', JSON.stringify(item))


							const emailMessage = {
									senderName: process.env.EMAIL_USER, 
									senderEmail: process.env.EMAIL_USER,
									replyTo: process.env.EMAIL_USER,
									receiverEmails: email,
									ccReceivers: null,
									bccReceivers: null,
									subject: ServerStrings.UnsubscribeEmail.Subject(email),
									messageText: ServerStrings.UnsubscribeEmail.BodyText(subscriber.email),
									html: null ,
									attachments: null
								}

							sendEmail(emailMessage,(error, info) => {
									var resultError = ""
									if (error) {
										console.error(`Could not send email - error: ${error}`)
										resultError = "Count not send email"
									} else {
										console.log("Successfully sent Unsubscribe alert email")
										resultError = false
									}
								})
							
						}
					})
				}
			})
		} else client.emit('subscriberRemoved', "WHAT", null)
	})
		
});

