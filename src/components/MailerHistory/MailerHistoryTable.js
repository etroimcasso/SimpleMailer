import React, { Component, Fragment, createRef } from 'react';
import { Table, Icon, Button } from 'semantic-ui-react';
import MailerHistoryViewer from './MailerHistoryViewer';

const convertUTCTimeToLocalTime = require('../../helpers/convertUTCTimeToLocalTime')
const UIStrings = require('../../config/UIStrings');


export default class MailerHistoryTable extends Component {
	state = {
		activeId: -1
	}

	contextRef = createRef()

	handleRowHover = (id) => {
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
						/*
						item.mailerResults.map((itemResult) => {
							results = results.concat(mailerHistoryResults.filter(filterFunc))

						})
						*/
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

		const errors = mailerResults.filter((result) => { return result.error !== "false" }).length

		const recipientCount = item.mailerResults.length

		const timeFormatString = 'h:m a'


		return(
			<Fragment>
				<Table.Row active={active} onMouseEnter={() => this.props.handleHover(item._id)} onMouseLeave={this.props.handleHoverLeave}>
					<Table.Cell>{item.subject}</Table.Cell>
					<Table.Cell>{convertUTCTimeToLocalTime(item.sent_on, timeFormatString)}</Table.Cell>
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
