import React, { Component } from 'react';
import { Segment, Dimmer, Loader, Container } from 'semantic-ui-react';
import MailerHistoryTable from './MailerHistoryTable'
import ItemsPlaceholderSegment from '../bits/ItemsPlaceholderSegment'
import { observer, inject } from "mobx-react"

const UIStrings = require('../../config/UIStrings');
const pageTitle = require('../../helpers/pageTitleFormatter')(UIStrings.PageTitles.History);


export default inject("mailerHistoryState")(observer(class MailerHistory extends Component {

	componentWillMount() {
		document.title = pageTitle
	}

	
	render() {
		const { mailerHistoryState: MailerHistoryState } = this.props
		const { mailerHistory, mailerHistoryLoaded, mailerHistoryResultsLoaded } = MailerHistoryState
		const historyLoaded = mailerHistoryLoaded && mailerHistoryResultsLoaded
		const mailerHistoryCount = MailerHistoryState.mailerHistoryCount

		return(
			<Container>
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
			</Container>
		)
	}
}))

