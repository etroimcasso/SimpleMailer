import React, { Component } from 'react';
import { Route, Redirect, Link } from 'react-router-dom';

import './App.css';
import 'semantic-ui-css/semantic.min.css'; 
import openSocket from 'socket.io-client';

import SimpleMailerController from './components/SimpleMailerController';
import ConnectionWrapper from './components/ConnectionWrapper'
import MailerHistoryController from './components/MailerHistory/MailerHistoryController'
import TopBar from './components/TopBar'


const hostname = require('./config/hostname.js');
const socket = openSocket(hostname.opensocket);
const UIStrings = require('./config/UIStrings');

export default class App extends Component {
  state= {
    subscriberInfoModalOpen: false,
    subscriberInfoMessage: "",
    subscriberError: false

  }


  AddSubscriberBridge = ({ match }) => {
    const email = match.params.email
    /*
      socket.on('subscriberAdded', (error) => {
        if (error) {
          this.setState({
            subscriberInfoMessage: UIStrings.SubscribeError(email)
          })
        }
        else {
          this.setState({
            subscriberInfoMessage: UIStrings.SubscribeSuccess(email)
          })
        }
    })
    */
    socket.emit('addSubscriber', email)
    return redirectAwayFromMailer()
  } 

  RemoveSubscriberBridge = ({match}) => {
    const email = match.params.email
    /*
    socket.on('subscriberRemoved', (error, subscriber) => {
      if (error) {
        this.setState({
          subscriberInfoMessage: UIStrings.UnsubscribeError(email)
        })
      } else {
        this.setState({
          subscriberInfoMessage: UIStrings.UnsubscribeSuccess(email)
        })
      } 
    })
    */
    socket.emit('removeSubscriber', email, match.params.id )
    return redirectAwayFromMailer()
  }

  
  subscriptionChangeResults = ({match}) => {

    /*
    switch (option) {
      case "subscribe":
        message = (error) ? UIStrings.SubscribeError(email): UIStrings.SubscribeSuccess(email)
        break;
      case "unsubscribe":
        message = (error) ? UIStrings.UnsubscribeError(email): UIStrings.UnsubscribeSuccess(email)
        break;
    }
    */

    return(
      <div>
        <span>{UIStrings.GenericSubscribeResult}</span>
      </div>
      )  
  }
  

	render() {

  	return (
  			<div className="App">
          <ConnectionWrapper>
            <TopBar />
          </ConnectionWrapper>
  				<Route exact path="/" component={SimpleMailerController} />
          <Route exact path="/history" component={MailerHistoryController} />
  				<Route path="/subscribe/:email" component={this.AddSubscriberBridge} />
          <Route path="/unsubscribe/:email/:id" component={this.RemoveSubscriberBridge} />
          <Route path="/subscribeResults" component={this.subscriptionChangeResults} />
    		</div>
  		)
  }
}

const redirectAwayFromMailer = () => {
  return(
    <Redirect to='/subscribeResults' />
  )
}
