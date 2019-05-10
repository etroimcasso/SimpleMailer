import React, { Component, Fragment } from 'react';
import { Segment, Modal } from 'semantic-ui-react';
import SubscribersDisplay from '../SubscribersDisplay';

const UIStrings = require('../../config/UIStrings');
const HtmlToReactParser = require('html-to-react').Parser;
const htmlToReactParser = new HtmlToReactParser();

const convertMailerResultsToSubscribersList = (mailerResults) => {
	var resultObject = []
	for (var i = 0; i < mailerResults.length; i++) {

		resultObject = resultObject.concat({
			email: mailerResults[i].recipient
		})
	}
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
					<Segment>
						<SubscribersDisplay subscribers={subscribersList} />
					</Segment>
					<Segment>
						{ htmlToReactParser.parse(mailer.bodyHTML) }
					</Segment>
				</Segment.Group>
			</Modal>
		)
	}
}