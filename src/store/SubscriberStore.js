import { decorate, observable, action, computed } from "mobx"
import openSocket from 'socket.io-client';
const hostname = require('../config/hostname.js');
const socket = openSocket(hostname.opensocket);
//const ReconnectionTimer = require('../helpers/ReconnectionTimer');

class SubscriberStore {
	subscribers = [] ///Rename all subscribersList props / states to this
	subscribersLoaded = false
	reloadSubscribersPending = true
	subscriberError = false

   	constructor() {
   		//this.getAllSubscribers()
   		socket.on('connect', () => {
   			if (this.reloadSubscribersPending) this.getAllSubscribers()
   		})

   		socket.on('disconnect', () => {
   			this.setReloadSubscribersPending(true)
   		})

   		socket.on('newSubscriberAdded', (subscriber) => this.addToSubscribersList(JSON.parse(subscriber)) )

   		socket.on('subscriberUnsubscribed', (email) => {
   			this.removeFromSubscribersList(email)
   		})

   		socket.on('noSubscribers', () => {
   		    this.setSubscribersLoaded(true)
   		})


   	}

   	setReloadSubscribersPending(isPending) {
   		this.reloadSubscribersPending = isPending
   	}

   	setSubscribersLoaded(isLoaded) {
   		this.subscribersLoaded = isLoaded
   	}

   	replaceSubscribersList(newList) {
   		this.subscribers = newList
   	}

   	addToSubscribersList(newItem) {
   		this.subscribers = this.subscribers.concat(newItem)
         console.debug("Add to subs")
         console.log(this.subscribers.length)
   	}

   	removeFromSubscribersList(email) {
   		this.subscribers = this.subscribers.filter((item) => item.email !== email )
   	}

   	dispatchGetSubscribersSocketMessage(callback) {
   	  socket.on('getAllSubscribersResult', (error, subscribers) => callback(error, subscribers))
   	  socket.emit('getAllSubscribers')
   	}
	
	//Reloads subscriber list
	getAllSubscribers() {
      /*
		ReconnectionTimer(3000, () => {
		  if (!this.subscribersLoaded) this.getAllSubscribers()
		})
   */

   		this.dispatchGetSubscribersSocketMessage((error, subscribers) => {
   			if (!error) {
   				this.replaceSubscribersList(JSON.parse(subscribers))
   				this.setSubscribersLoaded(true)
               this.setReloadSubscribersPending(false)
   			}
   		})
   	}

   	get subscriberCount() {
   		return this.subscribers.length
   	}

}

export default decorate(SubscriberStore, {
	subscribers: observable,
	subscribersLoaded: observable,
	reloadSubscribersPending: observable,
	subscriberError: observable,
	setReloadSubscribersPending: action,
	setSubscribersLoaded: action,
	replaceSubscribersList: action,
	addToSubscribersList: action,
	removeFromSubscribersList: action,
	getAllSubscribers: action,
	subscriberCount: computed,
})


