import React, { Component } from 'react';
import { Segment, Dimmer, Loader, Container } from 'semantic-ui-react';
import MailerHistoryTable from './MailerHistoryTable'
import { observer } from "mobx-react"
import AppStateStore from '../../store/AppStateStore'
import MailerHistoryStore from '../../store/MailerHistoryStore'
const MailerHistoryState = new MailerHistoryStore()

const UIStrings = require('../../config/UIStrings');
const pageTitle = require('../../helpers/pageTitleFormatter')(UIStrings.PageTitles.History);


export default observer(class MailerHistory extends Component {

	componentWillMount() {
		document.title = pageTitle
	}

	
	render() {
		const { mailerHistory, mailerHistoryLoaded, mailerHistoryResultsLoaded, mailerHistoryResults  } = MailerHistoryState

		const historyLoaded = mailerHistoryLoaded && mailerHistoryResultsLoaded

		return(
			<Segment basic>
				<Dimmer inverted active={!historyLoaded}>
					<Loader active={!mailerHistoryLoaded} inline>{UIStrings.MailerHistory.Loading}</Loader>
				</Dimmer>
				<Container>
					{	MailerHistoryState.getMailerHistoryCount() > 0 &&
						<MailerHistoryTable mailerHistory={mailerHistory} mailerHistoryResults={mailerHistoryResults} />
					} 
					{ (MailerHistoryState.getMailerHistoryCount() === 0 && mailerHistoryLoaded) &&
						<span>{UIStrings.MailerHistory.NoHistory}</span> 
					}		
				</Container>
			</Segment>
		)
	}
})

