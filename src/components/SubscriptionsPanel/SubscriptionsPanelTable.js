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
		const { subscribers, subscribersLoaded, handleSubscriberDeleteButtonClick } = this.props
		return(
			<Table striped celled>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell fullWidth >{UIStrings.SubscriptionsPanel.Table.Header.Email}</Table.HeaderCell>
						<Table.HeaderCell fullWidth >{UIStrings.SubscriptionsPanel.Table.Header.JoinDate}</Table.HeaderCell>
						<Table.HeaderCell />
					</Table.Row>
				</Table.Header>
				{ 
					subscribers.slice(0).reverse().map((item) => {
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
		const { deletePopupOpen } = this.state
		const { item, active, handleSubscriberDeleteButtonClick } = this.props

		const formatDate = 'MMMM Do YYYY'
		const formatTime = 'h:mm:ss A'

		const timeFormatString = `${formatDate}[, ]${formatTime}`

		return(
			<Fragment>
				<Table.Row active={active} onMouseEnter={() => this.props.handleHover(item._id)} onMouseLeave={this.props.handleHoverLeave}>
					<Table.Cell width={8}>{item.email}</Table.Cell>
					<Table.Cell width={6}>{convertUTCTimeToLocalTime(item.joined_on, timeFormatString)}</Table.Cell>
					<Table.Cell width={2}>
						<Popup 
						open={deletePopupOpen}
						subscriber={item} 
						trigger={<Button color='red' content={UIStrings.SubscriptionsPanel.DeleteButtonText} />}
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

