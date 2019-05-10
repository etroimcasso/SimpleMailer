import React, { Component, Fragment } from 'react';
import { Container, Segment, Dimmer, Loader, Table, Icon, Button} from 'semantic-ui-react';
import MailerHistoryViewer from './MailerHistoryViewer';
import openSocket from 'socket.io-client';

const hostname = require('../../config/hostname.js');
const socket = openSocket(hostname.opensocket);

const UIStrings = require('../../config/UIStrings');
const ReconnectionTimer = require('../../helpers/ReconnectionTimer')

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

class MailerHistoryTable extends Component {
	render() {
		const { mailerHistory, mailerHistoryResults } = this.props
		return(
			<Table celled>
				<Table.Header>
					<Table.HeaderCell>{UIStrings.MailerHistory.Table.Header.Subject}</Table.HeaderCell>
					<Table.HeaderCell>{UIStrings.MailerHistory.Table.Header.SendDate}</Table.HeaderCell>
					<Table.HeaderCell>{UIStrings.MailerHistory.Table.Header.Recipients}</Table.HeaderCell>
					<Table.HeaderCell />
				</Table.Header>
				{ 
					mailerHistory.map((item) => {
						var results = []
						//console.log( "mailerRESULT")
						//console.log(item.mailerResults)
						for (var i = 0; i < item.mailerResults.length; i++) {
							results = results.concat(mailerHistoryResults.filter((historyResult) => {
								return historyResult._id === item.mailerResults[i]
							}))
						}
						return (
							<MailerHistoryTableRowItem item={item} key={item} mailerResults={results} />
						)
					})
				}
			</Table>
		)
	}
}


class MailerHistoryTableRowItem extends Component {
	render() {
		const { item, mailerResults } = this.props

		var errors = 0
		mailerResults.map(result => {
			if (result.error != "false")
				++errors
		})

		const recipientCount = item.mailerResults.length


		return(
			<Fragment>
				<Table.Row>
					<Table.Cell>{item.subject}</Table.Cell>
					<Table.Cell>{item.sent_on}</Table.Cell>
					<Table.Cell error={errors > 0}>
							<Fragment>
								{ (errors > 0) &&
									<Icon name='attention' />
								}
								<span>{(errors === 0) ? recipientCount:`${recipientCount - errors}/${recipientCount}`}</span>
							</Fragment>
					</Table.Cell>
					<Table.Cell>
						<MailerHistoryViewer 
						trigger={<Button>{UIStrings.MailerHistory.ViewEntryButtonText}</Button>}
						mailer={item}
						mailerResults={mailerResults}
						/>
					</Table.Cell>
				</Table.Row>
			</Fragment>

		)
	}
}

//<Table.Cell></Table.Cell>