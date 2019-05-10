import React, { Component } from 'react';
import { Segment, Dimmer, Loader } from 'semantic-ui-react';
import MailerHistoryTable from './MailerHistoryTable'

const UIStrings = require('../../config/UIStrings');

export default class MailerHistory extends Component {

	
	render() {
		const { mailerHistory, mailerHistoryLoaded, mailerHistoryResults, mailerHistoryResultsLoaded } = this.props

		return(
			<Segment basic>
				<Dimmer inverted active={!mailerHistoryLoaded || !mailerHistoryResultsLoaded}>
					<Loader active={!mailerHistoryLoaded} inline>{UIStrings.MailerHistory.Loading}</Loader>
				</Dimmer>
				{	mailerHistory.length > 0 &&
					<MailerHistoryTable mailerHistory={mailerHistory} mailerHistoryResults={mailerHistoryResults} />
				} 
				{ mailerHistory.length === 0 &&
					<span>{UIStrings.MailerHistory.NoHistory}</span> 
				}		
			</Segment>
		)
	}
}

