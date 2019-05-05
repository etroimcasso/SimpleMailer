import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';

import './App.css';
import 'semantic-ui-css/semantic.min.css'; 
import openSocket from 'socket.io-client';

import SimpleMailer from './components/SimpleMailer';



const hostname = require('./config/hostname.js');
const socket = openSocket(hostname.opensocket);

export default class App extends Component {

  componentDidMount = () => {
    socket.on('subscriberRemoved', (error, subscriber) => {
      //Alerts the user that their email has been unsubscribed
      // using a controlled modal with just a message and an "OK" button 
    })
  }

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
		<Redirect to="/" />
	)
} 

const RemoveSubscriberBridge = ({match}) => {
  const email = match.params.email
  const subId = match.params.subId

  socket.emit('removeSubscriber', email, subId )
  return (
    <Redirect to ="/" />
  )
}
