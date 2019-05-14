import React, { Component } from 'react';
import { Segment, Dimmer, Loader, Container } from 'semantic-ui-react';
import MailerHistoryTable from './MailerHistoryTable'
import { observer } from "mobx-react"
import AppStateStore from '../../store/AppStateStore'
const AppState = new AppStateStore()

const UIStrings = require('../../config/UIStrings');
const pageTitle = require('../../helpers/pageTitleFormatter')(UIStrings.PageTitles.History);


export default observer(class MailerHistory extends Component {

	componentWillMount() {
		document.title = pageTitle
	}

	
	render() {
		const { mailerHistory, mailerHistoryResults } = this.props
		const { mailerHistoryLoaded, mailerHistoryResultsLoaded } = AppState

		return(
			<Segment basic>
				<Dimmer inverted active={!mailerHistoryLoaded || !mailerHistoryResultsLoaded}>
					<Loader active={!mailerHistoryLoaded} inline>{UIStrings.MailerHistory.Loading}</Loader>
				</Dimmer>
				<Container>
					{	mailerHistory.length > 0 &&
						<MailerHistoryTable mailerHistory={mailerHistory} mailerHistoryResults={mailerHistoryResults} />
					} 
					{ (mailerHistory.length === 0 && mailerHistoryLoaded) &&
						<span>{UIStrings.MailerHistory.NoHistory}</span> 
					}		
				</Container>
			</Segment>
		)
	}
})

