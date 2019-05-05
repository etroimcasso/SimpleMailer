import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';

import './App.css';
import 'semantic-ui-css/semantic.min.css'; 
import openSocket from 'socket.io-client';

import SimpleMailerConnectionWrapper from './components/SimpleMailerConnectionWrapper';



const hostname = require('./config/hostname.js');
const socket = openSocket(hostname.opensocket);

export default class App extends Component {
  state= {
    subscriberInfoModalOpen: false,
    subscriberInfoMessage: "",
    subscriberError: false

  }

  componentDidMount = () => {
    socket.on('subscriberRemoved', (error, subscriber) => {
      //Alerts the user that their email has been unsubscribed
      // using a controlled modal with just a message and an "OK" button 
      if (error) {

      } else {
        this.setState({
          subscriberInfoModalOpen: true,

        })
      }
    })
  }

	render() {

  		return (
  			<div className="App">
  				<Route exact path="/" component={SimpleMailerConnectionWrapper} />
  				<Route path="/subscribe/:email" component={AddSubscriberBridge} />
          <Route path="/unsubscribe/:email/:id" component={RemoveSubscriberBridge} />
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
  socket.emit('removeSubscriber', match.params.email, match.params.id )

  return (
    <Redirect to="/" />
  )
}
