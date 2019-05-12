import React, { Component } from 'react';
import { Segment, Dimmer, Loader, Container } from 'semantic-ui-react';
import SubscriptionsPanelTable from './SubscriptionsPanelTable'

const UIStrings = require('../../config/UIStrings');

export default class SubscriptionPanel extends Component {

	
	render() {
		const { subscribersList, subscribersLoaded, handleSubscriberDeleteButtonClick, onSubscriberAdd } = this.props

		return(
			<Segment basic>
				<Dimmer inverted active={!subscribersLoaded}>
					<Loader active={!subscribersLoaded} inline>Loading Subscribers</Loader>
				</Dimmer>
				<Container>
					{	subscribersList.length > 0 &&
						<SubscriptionsPanelTable subscribersList={subscribersList} subscribersLoaded={subscribersLoaded} handleSubscriberDeleteButtonClick={handleSubscriberDeleteButtonClick}/>
					} 
					{ (subscribersList.length === 0 && subscribersLoaded) &&
						<span>No Subscribers</span> 
					}		
				</Container>
			</Segment>
		)
	}
}


/*
				{ false &&
				<AddSubscriberForm onSubmit={onSubscriberAdd} />
				}
*/