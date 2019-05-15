import { decorate, observable, action} from "mobx"
import openSocket from 'socket.io-client';
import AppStateStore from '../../store/AppStateStore'
const AppState = new AppStateStore()
const hostname = require('../config/hostname.js');
const socket = openSocket(hostname.opensocket);
const ReconnectionTimer = require('./helpers/ReconnectionTimer');


const getAllSubscribers = (callback) => {
  socket.on('getAllSubscribersResult', (error, subscribers) => callback(error, subscribers))
  socket.emit('getAllSubscribers')
}


export default class SubscriberStore {
	subscribers = [] ///Rename all subscribersList props / states to this
	subscribersLoaded = false
	reloadSubscribersPending = false




   	constructor() {
   		this.getAllSubscribers()
   		socket.on('connect') {

   		}
   	}
	
	//Reloads subscriber list
	getAllSubscribers() {
   		getAllSubscribers((error, subscribers) => {
   			if (!error) 
   				this.subscribers = JSON.parse(subscribers) 
   		})
   	}



}

export default decorate(SubscriberStore, {
	subscribers: observable,
	subscribersLoaded: observable,
	reloadSubscribersPending: observable,
	addSubscriber: action,
	removeSubscriber: action,
	getAllSubscribers: action,

})


