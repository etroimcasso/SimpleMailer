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
>```

The `MONGO_COLLECTION_NAME_SINGULAR` and `MONGO_EMAIL_KEY` are selectors used to collect data from an existing database collection of Subscribers. 
For example, if you were attaching SimpleMailer to a website that has a MongoDB database of Users with their emails stored in an EmailAddress field, you would use

>MONGO_COLLECTION_NAME_SINGULAR=User    
>MONGO_EMAIL_KEY=EmailAddress

If left blank, these will default to Subscriber and email respectively.


### Create React App Stuff
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
