import React, { Component } from 'react';
import { Segment, Dimmer, Loader, Container } from 'semantic-ui-react';
import SubscriptionsPanelTable from './SubscriptionsPanelTable';
import AddSubscriberForm from './AddSubscriberForm';
import SubscriberStore from '../../store/SubscriberStore'
import openSocket from 'socket.io-client';
const SubscribersState = new SubscriberStore()
const UIStrings = require('../../config/UIStrings');
const pageTitle = require('../../helpers/pageTitleFormatter')(UIStrings.PageTitles.Subscriptions);
const hostname = require('../../config/hostname.js');
const socket = openSocket(hostname.opensocket);


//Subscriber is an object of email: and id:
const removeSubscriber = (subscriber) => {
  //socket.on('subscriberRemoved', (error, subscriber) => callback(error, subscriber))
  socket.emit('removeSubscriber', subscriber.email, subscriber.id)
}

const addSubscriber = (email) => {
    //socket.on('subscriberAdded', (error, subscriber) => callback(error, subscriber))
    socket.emit('addSubscriber', email)
} 


export default class SubscriptionPanel extends Component {

	componentWillMount() {
		document.title = pageTitle
	}

	handleSubscriberDeleteButtonClick = (subscriberObject) => {
	  removeSubscriber(subscriberObject, (error, subscriber) => {
	    // Don't need to do anything here since the subscriber list updates automatically whenever a subscriber is added or removed
	  })
	}

	handleAddSubscriberButtonClick = (email) => {
	  addSubscriber(email)
	}

	
	render() {
		const { subscribers, subscribersLoaded } = SubscribersState

		return(
			<Segment basic>
				<Dimmer inverted active={!subscribersLoaded}>
					<Loader active={!subscribersLoaded} inline></Loader>
				</Dimmer>
				<AddSubscriberForm onClick={this.handleAddSubscriberButtonClick} />
				<Container>
					{	SubscribersState.getSubscriberCount() > 0 &&
						<SubscriptionsPanelTable subscribers={subscribers} subscribersLoaded={subscribersLoaded} handleSubscriberDeleteButtonClick={this.handleSubscriberDeleteButtonClick}/>
					} 
					{ (SubscribersState.getSubscriberCount() === 0 && subscribersLoaded) &&
						<span>{UIStrings.NoSubscribers}</span> 
					}		
				</Container>
			</Segment>
		)
	}
}


