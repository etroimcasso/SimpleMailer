import React, { Component } from 'react';
import { Segment, Modal, Header } from 'semantic-ui-react';
import SubscribersList from '../bits/SubscribersList';

const UIStrings = require('../../config/UIStrings');
const HtmlToReactParser = require('html-to-react').Parser;
const htmlToReactParser = new HtmlToReactParser();

const convertMailerResultsToSubscribersList = (mailerResults) => {
	var resultObject = []
	mailerResults.map((item) => {
		resultObject = resultObject.concat({
			email: item.recipient
		})
		return 0
	})

	return resultObject
}

export default class MailerHistoryViewer extends Component {

	componentWillRender() {}

	render() {
		const { mailer, mailerResults, trigger} = this.props

		const subscribersList = convertMailerResultsToSubscribersList(mailerResults)

		return (
			<Modal trigger={trigger}>
				<Modal.Header>{mailer.subject}</Modal.Header>
				<Segment.Group>
					<Segment basic>
						<Header as="h3">{UIStrings.SubscribersNoun}</Header>
						<SubscribersList subscribers={subscribersList} />
					</Segment>
					<Segment>
						<Header as="h3">{UIStrings.ContentNoun}</Header>
						{ htmlToReactParser.parse(mailer.bodyHTML) }
					</Segment>
				</Segment.Group>
			</Modal>
		)
	}
}