# SimpleMailer

SimpleMailer is an easy-to-use Mailing List application that adds mailing list functionality to any website. SimpleMailer can be configured to work with an existing database collection or to use its own. 

SimpleMailer uses Node, Express, React, React Router, MongoDB, Mongoose, DraftJS, Nodemailer, Socket.IO, and Semantic-UI.

# Requirements
* Node 10.8.0+
* MongoDB 3.6.3+
* SSL Certificate and Key

# Features
* Easy-to-use, simple email interface
* WYSIWYG (What You See is What You Get) Email Editor
* Routes for adding and removing subscribers for integration with external sites
* Sent Mailer History Viewer


# Installation

### Clone project and install dependencies

1. Clone SimpleMailer to any `directory`

> git clone https://github.com/etroimcasso/SimpleMailer.git `directory`

2. Change directory to `directory`

> cd `directory`

3. Install dependencies

> npm install

4. Install pm2

> npm install pm2 -g

### Configure Project Settings
The .env file is used to configure the application's ports, email settings, and database settings.
Below is a .env template
>#### __.env__
>```
>HTTP_PORT=3000
>HTTPS_PORT=3001
>S_PORT=3001
>EMAIL_HOST=
>EMAIL_PORT=465
>EMAIL_USER=
>EMAIL_PASS=
>MONGO_HOST=
>MONGO_DB=
>MONGO_COLLECTION_NAME_SINGULAR=
>MONGO_EMAIL_KEY=
>MONGO_PORT=
>MONGO_USER=
>MONGO_PASS=    
>DISALLOW_LINKS=
>```

`DISALLOW_LINKS`  will disable the subscribe/unsubscribe links but is not implemented yet. Leaving this blank will default to false
`S_PORT` is the port value of the socket server    
The `MONGO_COLLECTION_NAME_SINGULAR` and `MONGO_EMAIL_KEY` are selectors used to collect data from an existing database collection of Subscribers.    
For example, if you were attaching SimpleMailer to a website that has a MongoDB collection of Users with their emails stored in an EmailAddress field, you would use

>MONGO_COLLECTION_NAME_SINGULAR=User    
>MONGO_EMAIL_KEY=EmailAddress    

If left blank, these will default to Subscriber and email respectively.

>#### __src/config/hostname.js__
>module.exports = {    
>	opensocket: '', //Address of this socket server    
>	unsubscribeHost: '' //Address of the server that handles unsubscribe links    
>}

### Configure SSL options
The SSL certificate files go in the `certs` folder.  
>key: server.key  
>certificate: server.crt  

#### SSL with Let's Encrypt
The Let's Encrypt tool will generate a number of files, but the important ones are:
>`privkey.pem` - rename to `server.key`  
>`fullchain.pem` - rename to `server.crt`

### Running the Application

1. Build the project    

>npm run build    

2. Run the production server    

>npm run production    

# Using the Subscriber Links
SimpleMailer provides links for adding and removing subscribers. These links are:
>/subscribe/subscriberEmail    

and    

>/unubscribe/subscriberEmail/subscriberId      

The unsubscribe link is sent to each subscriber when they sign up and when they receive mailers.

# Serving Static Content In Mailers
Desired content can be stored in `public/mailerContent`	 and accessed via `hostname/mailerContent`
