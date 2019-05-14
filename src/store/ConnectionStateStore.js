import { decorate, observable, action} from "mobx"
import openSocket from 'socket.io-client';
const hostname = require('../config/hostname.js');
const socket = openSocket(hostname.opensocket);

class ConnectionStateStore {
	connection = false;

   	constructor() {
   		socket.on('connect', () => {
   		  this.enableConnection()
   		})

   		socket.on('disconnect', () => {
   		  this.disableConnection()
   		})

   	}

   	enableConnection() {
   		 this.connection = true
   	}

   	disableConnection() {
   		 this.connection = false
   	}



}

const ConnectionState = decorate(ConnectionStateStore, {
	 connection: observable,
	 enableConnection: action,
	 disableConnection: action
 })


export default ConnectionState;
