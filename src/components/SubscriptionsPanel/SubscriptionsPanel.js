import React, { Component } from 'react';
import { Segment, Dimmer, Loader, Container } from 'semantic-ui-react';
import SubscriptionsPanelTable from './SubscriptionsPanelTable';
import AddSubscriberForm from './AddSubscriberForm';

const UIStrings = require('../../config/UIStrings');
const pageTitle = require('../../helpers/pageTitleFormatter')(UIStrings.PageTitles.Subscriptions);




export default class SubscriptionPanel extends Component {

	componentWillMount() {
		document.title = pageTitle
	}

	
	render() {
		const { subscribersList, subscribersLoaded, handleSubscriberDeleteButtonClick, onSubscriberAddClick, connection } = this.props

		return(
			<Segment basic>
				<Dimmer inverted active={!subscribersLoaded}>
					<Loader active={!subscribersLoaded} inline></Loader>
				</Dimmer>
				<AddSubscriberForm onClick={onSubscriberAddClick} connection={connection} />
				<Container>
					{	subscribersList.length > 0 &&
						<SubscriptionsPanelTable subscribersList={subscribersList} subscribersLoaded={subscribersLoaded} handleSubscriberDeleteButtonClick={handleSubscriberDeleteButtonClick}/>
					} 
					{ (subscribersList.length === 0 && subscribersLoaded) &&
						<span>{UIStrings.NoSubscribers}</span> 
					}		
				</Container>
			</Segment>
		)
	}
}


