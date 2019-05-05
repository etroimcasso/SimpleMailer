# SimpleMailer

SimpleMailer is an easy-to-use Mailing List application that adds mailing list functionality to any website. SimpleMailer can be configured to work with an existing database collection or to use its own. 

# Requirements
* Node 10.8.0+
* MongoDB 3.6.3+
* SSL Certificate and Key

# Features
* Easy-to-use, simple email interface
* WYSIWYG (What You See is What You Get) Email Editor
* Routes for adding and removing subscribers for integration with external sites


# Installation

### Clone project and install dependencies

1. Clone SimpleMailer to any `directory`

> git clone https://gitlab.com/etroimcasso/simplemailer.git `directory`

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
>ALLOW_LINKS=
>```

`ALLOW_LINKS` enables/disables the subscribe/unsubscribe links
The `MONGO_COLLECTION_NAME_SINGULAR` and `MONGO_EMAIL_KEY` are selectors used to collect data from an existing database collection of Subscribers. 
For example, if you were attaching SimpleMailer to a website that has a MongoDB database of Users with their emails stored in an EmailAddress field, you would use

>MONGO_COLLECTION_NAME_SINGULAR=User    
>MONGO_EMAIL_KEY=EmailAddress    

If left blank, these will default to Subscriber and email respectively.

>#### __src/config/hostname.js__
>module.exports = {    
>	opensocket: '', //Address of this socket server    
>	unsubscribeHost: '' //Address of the server that handles unsubscribe links    
>}

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
The unsubscribe link is sent to each subscriber when they sign up and when they receive mailers



This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).