import React, { Component, Fragment } from 'react';
import { Table, Icon, Button, Popup } from 'semantic-ui-react';
import { toJS } from 'mobx'
import { observer } from "mobx-react"
import MailerHistoryViewer from './MailerHistoryViewer';
import MailerHistoryStore from '../../store/MailerHistoryStore'

const MailerHistoryState = new MailerHistoryStore()

const convertUTCTimeToLocalTime = require('../../helpers/ConvertUTCTimeToLocalTime')
const UIStrings = require('../../config/UIStrings');


export default observer(class MailerHistoryTable extends Component {
	state = {
		activeId: -1
	}


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
		const { mailerHistory } = this.props
		const { mailerHistoryResults } = MailerHistoryState 
		const structuredMailerHistoryResults = toJS(mailerHistoryResults).map((item) => item)

		return(
			<Table striped celled>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell>{UIStrings.MailerHistory.Table.Header.Subject}</Table.HeaderCell>
						<Table.HeaderCell>{UIStrings.MailerHistory.Table.Header.Recipients}</Table.HeaderCell>
						<Table.HeaderCell>{UIStrings.MailerHistory.Table.Header.SendDate}</Table.HeaderCell>
						<Table.HeaderCell>{UIStrings.MailerHistory.Table.Header.SendTime}</Table.HeaderCell>
						<Table.HeaderCell />
					</Table.Row>
				</Table.Header>
				{ structuredMailerHistoryResults.length > 0 &&
					mailerHistory.map((item) => {
						const results = item.mailerResults.map((resultItem) => {
							const filterFunc = (historyResult) => historyResult._id === resultItem
							return structuredMailerHistoryResults.filter(filterFunc)
						}).map(resultMapItem => resultMapItem[0])
						
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
})


class MailerHistoryTableRowItem extends Component {
	render() {
		const { item, mailerResults, active } = this.props

		const errors = mailerResults.filter((result) => { return result.error !== "false" }).length

		const recipientCount = item.mailerResults.length
		const formatDate = 'MMMM Do YYYY'
		const formatTime = 'h:mm:ss A'

		const timeFormatString = `${formatDate}[, ]${formatTime}`


		return(
			<Fragment>
				<Table.Row error={errors > 0} active={active} onMouseEnter={() => this.props.handleHover(item._id)} onMouseLeave={this.props.handleHoverLeave}>
					<Table.Cell>{item.subject}</Table.Cell>
					<Table.Cell>
							<Fragment>
								{ (errors > 0) &&
									<Popup 
									content={UIStrings.GeneralErrors.NotAllEmailsSent} 
									trigger={<Icon name='exclamation triangle' />}
									position='top center' />
								}
								<span>{(errors === 0) ? recipientCount:`${recipientCount - errors}/${recipientCount}`}</span>
							</Fragment>
					</Table.Cell>
					<Table.Cell>{convertUTCTimeToLocalTime(item.sent_on, formatDate)}</Table.Cell>
					<Table.Cell>{convertUTCTimeToLocalTime(item.sent_on, formatTime)}</Table.Cell>
					<Table.Cell>
						<MailerHistoryViewer 
						trigger={<Button color='blue' >{UIStrings.MailerHistory.ViewEntryButtonText}</Button>}
						mailer={item}
						mailerResults={mailerResults}
						errors={errors}
						/>
					</Table.Cell>
				</Table.Row>
			</Fragment>

		)
	}
}