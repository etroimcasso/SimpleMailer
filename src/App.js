import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';

import './App.css';
import 'semantic-ui-css/semantic.min.css'; 
import openSocket from 'socket.io-client';


import SimpleMailerConnectionWrapper from './components/SimpleMailerConnectionWrapper';



const hostname = require('./config/hostname.js');
const socket = openSocket(hostname.opensocket);
const UIStrings = require('./config/UIStrings');

export default class App extends Component {
  state= {
    subscriberInfoModalOpen: false,
    subscriberInfoMessage: "",
    subscriberError: false

  }

  componentDidMount = () => {
  }

  AddSubscriberBridge = ({ match }) => {
    const email = match.params.email
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
    socket.emit('addSubscriber', email)

    //return(<span>{ this.state.subscriberInfoMessage }</span>)  
    return (<Redirect to='/' />)

  } 

  RemoveSubscriberBridge = ({match}) => {
    const email = match.params.email
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
    socket.emit('removeSubscriber', email, match.params.id )

    //return(<span>{ this.state.subscriberInfoMessage }</span>)  
    return (<Redirect to='/' />)
  }

	render() {

  	return (
  			<div className="App">
  				<Route exact path="/" component={SimpleMailerConnectionWrapper} />
  				<Route path="/subscribe/:email" component={this.AddSubscriberBridge} />
          <Route path="/unsubscribe/:email/:id" component={this.RemoveSubscriberBridge} />
    		</div>
  		)
  }
}


