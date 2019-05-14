import { decorate, observable, action} from "mobx"
import openSocket from 'socket.io-client';
const hostname = require('../config/hostname.js');
const socket = openSocket(hostname.opensocket);

export default class SubscriberStore {
	subscribers = [] ///Rename all subscribersList props / states to this

   	constructor() {
   		socket.on('connect') {

   		}
   	}


}

export default decorate(SubscriberStore, {
	subscribers: observable,
	addSubscriber: action,
	removeSubscriber: action,
	getAllSubscribers: action,
	fetchSubscribersFromServer: action

})


