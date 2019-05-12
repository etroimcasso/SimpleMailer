import React, { Component, Fragment } from 'react';
import { Table, Icon, Button, Popup, Divider } from 'semantic-ui-react';

const convertUTCTimeToLocalTime = require('../../helpers/ConvertUTCTimeToLocalTime')
const UIStrings = require('../../config/UIStrings');


export default class SubscriptionsPanelTable extends Component {
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
		const { subscribersList, subscribersLoaded, handleSubscriberDeleteButtonClick } = this.props
		return(
			<Table striped celled>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell>{UIStrings.SubscriptionsPanel.Table.Header.Email}</Table.HeaderCell>
						<Table.HeaderCell>{UIStrings.SubscriptionsPanel.Table.Header.JoinDate}</Table.HeaderCell>
						<Table.HeaderCell />
					</Table.Row>
				</Table.Header>
				{ 
					subscribersList.map((item) => {
						return (
							<SubscriptionPanelTableRowItem item={item} key={item} 
							handleHover={this.handleRowHover}
							handleHoverLeave={this.handleRowHoverLeave}
							handleSubscriberDeleteButtonClick={handleSubscriberDeleteButtonClick}
							active={item._id === activeId } />
						)
					})
				}
			</Table>
		)
	}
}


class SubscriptionPanelTableRowItem extends Component {
	state = {
		deletePopupOpen: false
	}

	handleOpen = () => {
		this.setState({
			deletePopupOpen: true
		})
	}

	handleClose = () => {
		this.setState({
			deletePopupOpen: false
		})
	}

	handleDeleteButtonClick = (subscriberObject) => {
		this.props.handleSubscriberDeleteButtonClick(subscriberObject)
		this.setState({
			deletePopupOpen: false
		})
	}

	render() {
		const { deletePopupOpen } = this.props
		const { item, active, handleSubscriberDeleteButtonClick } = this.props

		const formatDate = 'MMMM Do YYYY'
		const formatTime = 'h:mm:ss A'

		const timeFormatString = `${formatDate}[, ]${formatTime}`

		return(
			<Fragment>
				<Table.Row active={active} onMouseEnter={() => this.props.handleHover(item._id)} onMouseLeave={this.props.handleHoverLeave}>
					<Table.Cell>{item.email}</Table.Cell>
					<Table.Cell>{convertUTCTimeToLocalTime(item.joined_on, timeFormatString)}</Table.Cell>
					<Table.Cell>
						<Popup 
						open={deletePopupOpen}
						subscriber={item} 
						trigger={<Button color='red'>{UIStrings.SubscriptionsPanel.DeleteButtonText}</Button>} 
						on='click'
						header={UIStrings.SubscriptionsPanel.ConfirmDeleteMessage}
						onOpen={this.handleOpen} onClose={this.handleClose}
						content={
							<Fragment>
								<Divider clearing />
								<Button color='red' onClick={() => this.handleDeleteButtonClick({email: item.email, id: item._id})}>
									{UIStrings.SubscriptionsPanel.ConfirmDeleteButtonText}
								</Button>
							</Fragment>
						}
						/>
					</Table.Cell>
				</Table.Row>
			</Fragment>

		)
	}
}

