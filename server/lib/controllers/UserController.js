require('dotenv').config();
//Mongoose
const mongoose = require('mongoose')
//User schema
const User = require('../models/User')

module.exports = {
	//callback(error, userObject)
	insertUser: (username, password, callback) => {
		const normalizedUsename = username.toLowerCase()
		bcrypt.hash(password, 10, (error, hashedPassword) => {
			if (error)  callback(error, null)\
			else {
				User.create({
					username: normalizedUsename,
					password: hashedPassword
				}, (error, userObject) => {
					if (error) callback(error, null)
					else {
						callback(null, userObject)
					}
				})
			}
				
		})
	}
}