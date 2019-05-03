//Mongoose
const mongoose = require('mongoose')
//Subscriber schema
const Subscriber = require('../models/Subscriber')

/*
const __MONGO_URI__ = 'mongodb://' + 
               //process.env.MONGO_USER + 
               //':' + process.env.MONGO_PASS + '@' + 
               process.env.MONGO_HOST + 
                ':' + process.env.MONGO_PORT + 
                '/' + process.env.MONGO_DB;
*/
const __MONGO_URI__ = `mongodb://${(!process.env.MONGO_USER) ? "" : process.env.MONGO_USER }${(!process.env.MONGO_PASS) ? "" : `:${process.env.MONGO_USER}@`}${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`
                
mongoose.connect(__MONGO_URI__);

const isSubscriberUnique = (subscriber) => {

}

//Public functions
module.exports = {

	addSubscriber: (email, callback) => {
		Subscriber.create({
			email: email.toLowerCase(),
			joined_on: Date.now(),
		}, (error, item) => {
			if (error) {
				//Could not add Subscriber
				return callback(error, false) 
			}
			// Subscriber successfully added
			return callback(false, true)
		})
	},

	removeSubscriber: (subscriberId, callback) => {
		Subscriber.remove({ _id: subscriberId }, (error, item) => {
			if (error) return (error, false)
			return callback(null, true)
		})

	},

	listAllSubscribers: (callback) => {
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
	}

}