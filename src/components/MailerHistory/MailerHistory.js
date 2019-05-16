import React, { Component } from 'react';
import { Segment, Dimmer, Loader, Container } from 'semantic-ui-react';
import MailerHistoryTable from './MailerHistoryTable'
import ItemsPlaceholderSegment from '../bits/ItemsPlaceholderSegment'
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
		const { mailerHistory, mailerHistoryLoaded, mailerHistoryResultsLoaded } = MailerHistoryState
		const historyLoaded = mailerHistoryLoaded && mailerHistoryResultsLoaded
		const mailerHistoryCount = MailerHistoryState.mailerHistoryCount

		return(
			<Segment basic>
				<Dimmer inverted active={!historyLoaded}>
					<Loader active={!mailerHistoryLoaded} inline>{UIStrings.MailerHistory.Loading}</Loader>
				</Dimmer>
				<Container>

					<ItemsPlaceholderSegment itemCount={mailerHistoryCount} itemsLoaded={historyLoaded} noItemsText={UIStrings.MailerHistory.NoHistory} iconName="envelope outline">
						<MailerHistoryTable mailerHistory={mailerHistory} />
					</ItemsPlaceholderSegment>
				</Container>
			</Segment>
		)
	}
})

