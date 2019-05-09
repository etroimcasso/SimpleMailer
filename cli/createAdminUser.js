#!/usr/bin/env node
const UserController = require(`../server/lib/controllers/UserController`)
const inquirer = require('inquirer')
const InputValidator = require('../src/helpers/InputValidator')
const CliStrings = require('./CliStrings')
//Mongoose
const mongoose = require('mongoose')
//MongoDBURL Helper
const __MONGO_URI__ = require('../server/lib/helpers/MongoDBConnectionURI')
mongoose.connect(__MONGO_URI__, {useNewUrlParser: true, useCreateIndex: true });


const validatorSettings = {
	username: {
		minLength: 6,
		maxLength: 24
	},
	password: {
		minLength: 12,
		maxLength: 32

	},
}

mongoose.connection.once('open', () => {
	inquirer.prompt([
		{
			type: 'input',
			name: 'username',
			message: 'Enter admin username:'
		},
		{
			type: 'password',
			name: 'password',
			message: 'Enter password:'
		},
		{
			type: 'password',
			name: 'passwordConfirm',
			message: 'Confirm password:'
		}
	]).then(answers => {
		const username = answers['username']
		const password = answers['password']
		const passwordConfirm = answers['passwordConfirm']
		const passwordsMatch = password === passwordConfirm
		const usernameValid = InputValidator.fieldIsMinimumLength(username, validatorSettings.username.minLength) 
			&& !InputValidator.fieldIsEmpty(username)
			&& !InputValidator.fieldExceedsMaximumLength(username, validatorSettings.username.maxLength)

		const passwordsAreValid = InputValidator.fieldIsMinimumLength(password, validatorSettings.password.minLength) 
			&& !InputValidator.fieldExceedsMaximumLength(password, validatorSettings.password.maxLength) 
			&& !InputValidator.fieldIsEmpty(password)
			
		if (passwordsMatch) {
			if (passwordsAreValid) {
				if (usernameValid) {
					UserController.insertUser(username, password, true, (error, userObject) => {
						if (error) console.log(CliStrings.AddAdminUserFailure(error))
						else {
							console.log(CliStrings.AddAdminUserSuccess(userObject.username))
							process.exit()
						}
					})
				} else {
					console.log(CliStrings.InvalidUsername)
				}
			} else {
				console.log(CliStrings.InvalidPassword)
			}
		} else {
			console.log(CliStrings.PasswordsDoNotMatch)
		}
	})

})


