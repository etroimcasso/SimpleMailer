import React, { Component } from 'react';
import { Icon, List, Transition } from 'semantic-ui-react';

export default class MailerResultsList extends Component {
	render() {
		const { items } = this.props
		return (
			<Transition.Group as={List} divided relaxed>
				{items.map(item => <MailerResultsListItem item={item}/>)}
			</Transition.Group>
		)
	}
}

class MailerResultsListItem extends Component {
	render() {
		const { item } = this.props

		const emailIconColor = (!item.error) ? "green" : "red"
		const emailIcon = (<Icon name="mail" color={emailIconColor} size="big" />)


		const email = item.email

		return (
			<List.Item key={email} size="massive">
				{emailIcon}
				<List.Content>
					{(item.error) ? `Could not email ${email}` : `Sent email to ${email}`}
				</List.Content>
			</List.Item>
		)
	}
}


