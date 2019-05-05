import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import './App.css';
import 'semantic-ui-css/semantic.min.css'; 
import openSocket from 'socket.io-client';

import SimpleMailer from './components/SimpleMailer';



const hostname = require('./config/hostname.js');
const socket = openSocket(hostname.opensocket);

export default class App extends Component {

	render() {

  		return (
  			<div className="App">
  				<Route exact path="/" component={SimpleMailer} />
  				<Route path="/addSubscriber/:email" component={AddSubscriberBridge} />
    		</div>
  		)
  	}
}

const AddSubscriberBridge = ({ match }) => {
	socket.emit('addSubscriber', match.params.email)
	return(
		<span>Added {match.params.email}</span>
	)
} 
