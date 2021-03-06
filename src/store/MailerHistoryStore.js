import { decorate, observable, action, computed } from "mobx"
import openSocket from 'socket.io-client';

const hostname = require('../config/hostname.js');
const socket = openSocket(hostname.opensocket);
//const ReconnectionTimer = require('../helpers/ReconnectionTimer');



class MailerHistoryStore {
	mailerHistory = [] ///Rename all subscribersList props / states to this
	mailerHistoryLoaded = false
	mailerHistoryResults = []
	reloadMailerHistoryPending = true
	mailerHistoryResultsLoaded = false
  reloadMailerHistoryResultsPending = true

   	constructor() {
   		//this.getAllMailers()
   		//this.getAllMailerResults()

   		socket.on('connect', () => {
   			if (this.reloadMailerHistoryPending) this.getAllMailers()
   			if (this.reloadMailerHistoryResultsPending) this.getAllMailerResults()
   		})

   		socket.on('disconnect', () => {
   			this.setReloadMailerHistoryPending(true)
   			this.setReloadMailerHistoryResultsPending(true)
   		})

   		socket.on('mailerAddedToHistory', (mailer) => {
   			this.addToMailerHistory(JSON.parse(mailer))
   			this.getAllMailerResults() //Reload MailerResults

   		})

   		socket.on('noMailers', () => {
        	this.setMailerHistoryLoaded(true)
	        //this.setMailerHistoryResultsLoaded(true)
        })

        socket.on('noMailerResults', () => {
          this.setMailerHistoryResultsLoaded(true)
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
   	  socket.on('getAllMailersResults', (error, history) => callback(error, history))
   	  socket.emit('getAllMailers')
   	}
	
	//Reloads subscriber list
	getAllMailers() {
    /*
		ReconnectionTimer(3000, () => {
		  if (!this.mailerHistoryLoaded) this.getAllMailers()
		})
  */

   		this.dispatchGetMailerHistorySocketMessage((error, mailerHistory) => {
   			if (!error) {
   				this.replaceMailerHistory(JSON.parse(mailerHistory))
   				this.setMailerHistoryLoaded(true)
          this.setReloadMailerHistoryPending(false)
   			}
   		})
   	}

   	dispatchGetMailerHistoryResultsSocketMessage(callback) {
   	  socket.on('getAllMailerResultsResults', (error, results) => callback(error, results))
   	  socket.emit('getAllMailerResults')
   	}

   	getAllMailerResults() {
      /*
   	  ReconnectionTimer(3000,() => { 
   	    if (!this.mailerHistoryResultsLoaded) 
   	      this.getAllMailerResults() 
   	  })
      */

   	  this.dispatchGetMailerHistoryResultsSocketMessage((error, mailerHistoryResults) => {
   	    if (!error) {
   	      this.setMailerHistoryResultsLoaded(true)
   	      this.replaceMailerHistoryResults(JSON.parse(mailerHistoryResults))
          this.setReloadMailerHistoryResultsPending(false)
   	    }
   	  })
   	}
   	replaceMailerHistoryResults(newHistoryResults) {
   		this.mailerHistoryResults = newHistoryResults
   	}

   	addToMailerHistoryResults(newItem) {
   		this.mailerHistoryResults = this.mailerHistoryResults.concat(newItem)
   	}

   	get mailerHistoryCount() {
   		return this.mailerHistory.length
   	}

   	setReloadMailerHistoryResultsPending(isPending) {
          this.reloadMailerHistoryResultsPending = isPending
    }

    setMailerHistoryResultsLoaded(isLoaded) {
     	this.mailerHistoryResultsLoaded = isLoaded
    }

    get allMailerHistoryResults() { 
      return this.mailerHistoryResults 
    }

}

export default decorate(MailerHistoryStore, {
	mailerHistory: observable,
	mailerHistoryLoaded: observable,
	mailerHistoryResults: observable,
	reloadMailerHistoryPending: observable,
	mailerHistoryResultsLoaded: observable,
	reloadMailerHistoryResultsPending: observable,
	setReloadMailerHistoryPending: action,
	setMailerHistoryLoaded: action,
	replaceMailerHistory: action,
	replaceMailerHistoryResults: action,
	addToMailerHistory: action,
	addToMailerHistoryResults: action,
	removeFromMailerHistory: action,
	getAllMailers: action,
	getAllMailerResults: action,
	mailerHistoryCount: computed,
	setReloadMailerHistoryResultsPending: action,
	setMailerHistoryResultsLoaded: action,
  allMailerHistoryResults: computed

})


