import React, { Component } from 'react';
import { Icon, List, Transition } from 'semantic-ui-react';

const UIStrings = require('../../config/UIStrings')

const listSize = {
	height: '50vh'
}

export default class MailerResultsList extends Component {
	render() {
		const { items } = this.props
		return (
			<Transition.Group as={List} celled relaxed style={listSize}>
				{items.map(item => <MailerResultsListItem item={item}/>)}
			</Transition.Group>
		)
	}
}

class MailerResultsListItem extends Component {
	render() {
		const { item } = this.props

		const emailIconColor = (!item.error) ? "green" : "red"
		const emailIcon = (<Icon name="mail" color={emailIconColor} />)


		const email = item.email

		return (
			<List.Item key={email} size="massive">
				{emailIcon}
				<List.Content>
					{(item.error) ? UIStrings.MailerResults.Failure : UIStrings.MailerResults.Success }<b>{email}</b>
				</List.Content>
			</List.Item>
		)
	}
}


