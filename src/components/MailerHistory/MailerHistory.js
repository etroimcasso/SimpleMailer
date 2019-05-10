import React, { Component, Fragment, createRef } from 'react';
import { Segment, Dimmer, Loader, Table, Icon, Button } from 'semantic-ui-react';
import MailerHistoryViewer from './MailerHistoryViewer';

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

class MailerHistoryTable extends Component {
	state = {
		activeId: -1
	}

	contextRef = createRef()

	handleRowHover = (id) => {
		console.log("ENTER")
		console.log(id)
		this.setState({
			activeId: id
		})
	}

	handleRowHoverLeave = () => {
		this.setState({
			activeId: -1
		})
	}

	render() {
		const { activeId } = this.state
		const { mailerHistory, mailerHistoryResults } = this.props
		return(
			<Table striped celled>
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
						const filterFunc = (historyResult) => historyResult._id === item.mailerResults[i]
						for (var i = 0; i < item.mailerResults.length; i++) {
							results = results.concat(mailerHistoryResults.filter(filterFunc))
						}
						return (
							<MailerHistoryTableRowItem item={item} key={item} 
							handleHover={this.handleRowHover}
							handleHoverLeave={this.handleRowHoverLeave}
							active={item._id === activeId } mailerResults={results} />
						)
					})
				}
			</Table>
		)
	}
}


class MailerHistoryTableRowItem extends Component {
	render() {
		const { item, mailerResults, active } = this.props

		/*
		var errors = 0
		mailerResults.map(result => {
			if (result.error != "false")
				++errors
		})
		*/

		const errors = mailerResults.filter((result) => { return result.error !== "false" }).length

		const recipientCount = item.mailerResults.length


		return(
			<Fragment>
				<Table.Row active={active} onMouseEnter={() => this.props.handleHover(item._id)} onMouseLeave={this.props.handleHoverLeave}>
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
						trigger={<Button color='blue' >{UIStrings.MailerHistory.ViewEntryButtonText}</Button>}
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