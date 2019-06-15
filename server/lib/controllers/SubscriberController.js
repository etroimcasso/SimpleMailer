require('dotenv').config();
//Mongoose
const mongoose = require('mongoose')
//Subscriber schema
const Subscriber = require('../models/Subscriber')
//input Validator
const InputValidator = require('../../../src/helpers/InputValidator.js');

//Public functions
module.exports = {

	
	addSubscriber: (email, callback) => {
		if (InputValidator.fieldIsValidEmail(email)) {
			Subscriber.create({
				email: email.toLowerCase(),
				joined_on: Date.now(),
			}, (error, item) => {
				if (error) {
					//Could not add Subscriber
					return callback(error, null) 
				}
				// Subscriber successfully added
				return callback(false, item)
			})
		} else {
			callback("Invalid email", null)
		}
	},

	removeSubscriber: (subscriberId, callback) => {
		Subscriber.deleteOne({ _id: subscriberId }, (error, item) => {
			if (error) return (error, false)
			return callback(null, item)
		})

	},
	

	getAllSubscribers: (callback) => {
		Subscriber.find({}, (error, subscribers) => {
			if (error) return (error, false)
			return callback(null, subscribers)
		})
	},

	getSubscriber: (subscriberId, callback) => {
		Subscriber.findOne({ _id: subscriberId }, (error, subscriber) => {
			if (error) return (error, false)
			return callback(null, subscriber)
		})
	},

	getSubscriberByEmail: (subscriberEmail, callback) => {
		Subscriber.findOne({ email: subscriberEmail }, (error, subscriber) => {
			if (error) return (error, false)
			return callback(null, subscriber)
		})
	},

	getSubscriberCount: (callback) => {
		Subscriber.count({}, (error, count) => {
			if (error) return (error, false)
			return callback(null, count)
		})
	},

	getOneSubscriberByQuery: (query, callback) => {
		Subscriber.findOne(query, (error, item) => {
			if (error) return (error, false)
			return callback(null, item)
		})
	}

}