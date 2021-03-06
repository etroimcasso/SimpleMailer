import React, { Component } from 'react';
import { Icon, List, Transition } from 'semantic-ui-react';
import { observer } from "mobx-react"
const UIStrings = require('../../config/UIStrings')

const listSize = {
	height: '40vh',
}

export default observer(class MailerResultsList extends Component {
	render() {
		const { items } = this.props
		
		return (
			<Transition.Group as={List} duration={200}Z celled relaxed style={listSize}>
				{items.map(item => <MailerResultsListItem item={item} key={item._id}/>)}
			</Transition.Group>
		)
	}
})

class MailerResultsListItem extends Component {
	render() {
		const { item } = this.props

		//const emailIconColor = (!item.error) ? null : "red"
		const emailIcon = (<Icon name="check" color="green" />)
		const emailFailIcon = (<Icon name="cancel" color="red" />)

		const email = item.email

		return (
			<List.Item key={email} size="massive">
				{(!item.error) ? emailIcon : emailFailIcon}
				<List.Content>
					{(item.error) ? UIStrings.MailerResults.Failure : UIStrings.MailerResults.Success }<b>{email}</b>
				</List.Content>
			</List.Item>
		)
	}
}


