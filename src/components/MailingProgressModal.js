import React, { Component } from 'react';
import { Container, Button, Icon } from 'semantic-ui-react';


export default class MailingProgressModal extends Component {

	render() {
		const {mailerResults, mailerBeingSent, allMailSent,  totalSubscribers, currentSubscriberNumber } = this.props

		return (
			<div>
				<MailingProgressIndicator totalSubscribers={totalSubscribers} currentSubscriberNumber={currentSubscriberNumber} />
				<MailerResultsList items={mailerResults} />
			</div>
		)
	}
}

//Needs to display progress bar of current mailer
//Progress = (100 / total subscribers) * currentSubscriberNumber
const calculateProgress = (totalSubscribers, currentSubscriberNumber) => (100 / totalSubscribers) * currentSubscriberNumber

class MailingProgressIndicator extends Component {

	render() {
		return (
			<div></div>
		)
	}
}

class MailerResultsList extends Component {
	renderMailerResults = (item) => {
		const email = item.email
		if (!item.error) {
			return (
				<div>{`Sent email to ${email}`}</div>
			)
		} else {
			return (
				<div>{`Could not email ${email}`}</div>
			)
		}
	}

	render() {
		const { items } = this.props
		return (
			<Container>
				{items.map(item => this.renderMailerResults(item))}
			</Container>
		)
	}
}



