require('dotenv').config();
//Mongoose
const mongoose = require('mongoose')
//User schema
const User = require('../models/User')
//bcrypt
const bcrypt = require('bcrypt')

module.exports = {
	//callback(error, userObject)

	insertUser: (username, password, isUserAdmin, callback) => {
		//console.log("ADDING USER")
		const normalizedUsename = username.toLowerCase()
		bcrypt.hash(password, 10, (error, hashedPassword) => {
			if (error) {
				console.log(error)
				callback(error, null)
			}
			else {
				User.create({
					username: normalizedUsename,
					password: hashedPassword,
					isAdmin: isUserAdmin
				}, (error, userObject) => {
					if (error) {
						console.log(`Could not add user: ${error}`)
						callback(error, null)
					}
					else {
						callback(null, userObject)
					}
				})
			}
				
		})
	},

	//Compares the hash of 'password' with the password hash associatated with 'username'
    authenticateUser(username, password, callback) {
        User.authenticate(username, password, function(err, auth) {
            if (err) return callback(err);
            return callback(null, auth);
        });
    },

}