import { decorate, observable, action, computed } from "mobx"
import openSocket from 'socket.io-client';
const hostname = require('../config/hostname.js');
const socket = openSocket(hostname.opensocket);
const ReconnectionTimer = require('../helpers/ReconnectionTimer');

class MailerHistoryStore {
	mailerHistory = [] ///Rename all subscribersList props / states to this
	mailerHistoryLoaded = false
	reloadMailerHistoryPending = false

   	constructor() {
   		this.getAllMailers()
   		socket.on('connect', () => {
   			if (this.reloadMailerHistoryPending) this.getAllMailers()
   				this.setReloadMailerHistoryPending(false)
   		})

   		socket.on('disconnect', () => {
   			this.setReloadMailerHistoryPending(true)
   		})

   		socket.on('mailerAddedToHistory', (mailer) => this.addToSubscribersList(JSON.parse(mailer)) )

   		socket.on('noMailers', () => {
        	this.setMailerHistoryLoaded(true)
	        this.setReloadMailerHistoryPending(false)
        })

   	}

   	setReloadMailerHistoryPending(isPending) {
   		this.reloadMailerHistoryPending = isPending
   	}

   	setMailerHistoryLoaded(isLoaded) {
   		this.mailerHistoryLoaded = isLoaded
   	}

   	replaceMailerHistory(newHistory) {
   		this.mailerHistory = newHistory
   	}

   	addToMailerHistory(newItem) {
   		this.mailerHistory = this.mailerHistory.concat(newItem)
   	}


   	dispatchGetMailerHistorySocketMessage(callback) {
   	  socket.on('getAllMailersResults', (error, subscribers) => callback(error, subscribers))
   	  socket.emit('getAllMailers')
   	}
	
	//Reloads subscriber list
	getAllMailers() {
		ReconnectionTimer(3000, () => {
		  if (!this.mailerHistoryLoaded) this.getAllMailers()
		})

   		this.dispatchGetMailerHistorySocketMessage((error, mailerHistory) => {
   			if (!error) {
   				this.replaceMailerHistory(JSON.parse(mailerHistory))
   				this.setMailerHistoryLoaded(true)
   			}
   		})
   	}

   	getMailerHistoryCount() {
   		return this.mailerHistory.length
   	}

}

export default decorate(MailerHistoryStore, {
	subscribers: observable,
	mailerHistoryLoaded: observable,
	reloadMailerHistoryPending: observable,
	setReloadMailerHistoryPending: action,
	setMailerHistoryLoaded: action,
	replaceMailerHistory: action,
	addToMailerHistory: action,
	removeFromMailerHistory: action,
	getAllMailers: action,
	getMailerHistoryCount: action,

})


