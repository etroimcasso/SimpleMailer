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

		Emailer.sendEmail(emailMessage, (error, info) => {
				var resultError = ""
				if (error) {
					console.error(`Could not send email - error: ${error}`)
					resultError = "Count not send email"
				} else {
					console.log("Successfully sent email")
					resultError = false
				}
				client.emit('sendEmailResults', resultError)
			})
	})

	//Tests the email's connection
	//   returns false if successful, and an error message if there is an error
	client.on('testEmail', () => {
		Emailer.testConnection(function(error, success) {
			console.log("attempt to verify smtp")
			var resultError = ""
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

});