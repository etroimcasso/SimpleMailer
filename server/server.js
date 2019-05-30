require('dotenv').config();

const express = require('express');
const path = require('path');
const fs = require('fs');
const http = require('https');
const https = require('https');
const app = express();
const port = process.env.S_PORT;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose')
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const Emailer = require('./lib/Emailer')
const SubscriberController = require('./lib/controllers/SubscriberController')
const MailerController = require('./lib/controllers/MailerController')
const MailerResultController = require('./lib/controllers/MailerResultController')
const FileSystemController = require('./lib/controllers/FileSystemController')
const ServerStrings = require('./config/ServerStrings')
const FileFilterTypes = require('./config/FileTypeGroups')
const FrontendRoutes = require('../src/config/Routes')
const UserController = require('./lib/controllers/UserController')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('forceSSLOptions', {
  httpsPort: process.env.HTTPS_PORT
});

//Force SSL
const forceSsl = require('express-force-ssl');


const ssl_options = {
	httpsPort: process.env.HTTPS_PORT,
  	key: fs.readFileSync(path.join(__dirname,'../certs/server.key')),
  	cert: fs.readFileSync(path.join(__dirname,'../certs/server.crt')),
}
app.use(forceSsl)

//MongoDBURL Helper
const __MONGO_URI__ = require('./lib/helpers/MongoDBConnectionURI')
mongoose.connect(__MONGO_URI__, {useNewUrlParser: true, useCreateIndex: true });
const db = mongoose.connection

//Sessions
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}))


const root = require('path').join(__dirname, '..', 'build')
const staticRoot = require('path').join(__dirname, '..', 'build/static')
const mailerContentRoot = require('path').join(__dirname, '..', 'mailerContent')
console.log(`MailerContent root: ${mailerContentRoot}`)
app.use('/static', express.static(staticRoot, { redirect: false }));
//app.set('views', path.join(__dirname, './views'));
//app.set('view engine', 'pug');

const renderRoot = (res) => res.sendFile('index.html', { root })

//Route for mailer content
app.get("/mailerContent/:fileName(*)", (req, res, next) => res.sendFile(path.join(mailerContentRoot, `${req.params.fileName}`)))

//Subscriber Routes
app.get('/subscribe/*', (req, res) => renderRoot(res))

app.get('/unsubscribe/*', (req, res) => renderRoot(res))

app.get('/subscribeResults/*', (req, res) => renderRoot(res))

app.post('/util/login', (req, res, next) => {
	if (req.body) {
		const user = req.body.username 
		const password = req.body.password 
		 if (user && password) {	
			UserController.authenticateUser(user, password, (error, user) => {
				if (error) { 
					res.json({
						error: error,
					})
				} else {
					req.session.userId = user._id
					res.json({
						error: null
					})
				}
			})
		}
	} else res.redirect('/')

})


app.post('/util/logout', function (req, res, next) {
	console.log(req.session)
    if (req.session.userId) {
        req.session.destroy((error) => {
            if (error) {
            	console.error(`Error removing session: ${error}`)
            	res.json({
            		error: error
            	})
            } else {
            	res.json({
            		error: null
            	})
            }
        })
    }
})


//Route for everything else
app.get("*", (req, res) => {
		const protectedRouteKeys = Object.keys(FrontendRoutes.ProtectedRoutes)
		const protectedRoutes = protectedRouteKeys.map(item => FrontendRoutes.ProtectedRoutes[item])
		const isRouteProtected = protectedRoutes.filter(item => item === req.url).length > 0
		const userLoggedIn = req.session.userId !== null && req.session.userId !== undefined
		if (req.url !== '/login')
			if (isRouteProtected) {
				if (req.session) //There is a session
					if (!userLoggedIn) res.redirect('/login')
					else renderRoot(res)  //User is logged in
				else res.redirect('/login') // There is no session
			} else res.sendFile(path.join(root, req.url ))
		else {
			if (userLoggedIn) res.redirect('/')
			else renderRoot(res)
		}
})


const server = https.createServer(ssl_options, app);

const io = require('socket.io')(server);


http.createServer(app).listen(process.env.HTTP_PORT)
server.listen(process.env.HTTPS_PORT,() => {
	console.log(`Listening on port ${process.env.HTTPS_PORT}`)
})

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
									if (error) {
										console.error(`Could not send email - error: ${error}`)
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

	client.on('getFileListing' , (directory) => {
		/*
		FileSystemController.getFiles((error, files) => {
			if (error) client.emit('getMailerContentFilesResults', error, null)
			client.emit('getMailerContentFilesResults', null, files)
		})
		*/
		FileSystemController.getFiles(directory, (error, files) => {
			client.emit('getFileListingResults', error, files)
		})

		

	})

	client.on('getAllFilterTypes', () => {
		client.emit('getAllFilterTypesResults', FileFilterTypes.map(item => { return {type: item.type, name: item.name}}))
	})

	client.on('createNewDirectory', (path, directory) => {
		FileSystemController.createDirectory(path, directory, (error) => {
			client.emit('createNewDirectoryResults', (error))
		})
	})
		
});

