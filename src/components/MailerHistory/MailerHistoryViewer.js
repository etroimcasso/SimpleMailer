import React, { Component, Fragment } from 'react';
import { Segment, Modal, Header, Label, Progress } from 'semantic-ui-react';
import SubscribersList from '../bits/SubscribersList';

const UIStrings = require('../../config/UIStrings');
const HtmlToReactParser = require('html-to-react').Parser;
const htmlToReactParser = new HtmlToReactParser();

const convertMailerResultsToSubscribersList = (mailerResults) => {
	var resultObject = []
	mailerResults.map((item) => {
		resultObject = resultObject.concat({
			email: item.recipient,
			error: item.error !== "false" && item.error !== null
		})
		return 0
	})

	return resultObject
}

const styles = {
	height: {
		height: '21vh',
	},

}

export default class MailerHistoryViewer extends Component {

	
	render() {
		const { mailer, mailerResults, trigger, errors } = this.props

		const subscribersList = convertMailerResultsToSubscribersList(mailerResults)
		const progressIndicator = (attachTo) => { 
			return (
				<Progress attached={attachTo} percent={100} error={errors > 0} success={errors === 0}></Progress>
			)
		}


		return (
			<Modal trigger={trigger} >
				{progressIndicator('top')}
				<Modal.Header>{mailer.subject}</Modal.Header>
				<Modal.Content scrolling>
				<Segment.Group>
					<Segment basic>
						<Header as="h3">
							<span>
								{UIStrings.SubscribersNoun}
								<Label circular >
									{subscribersList.length}
								</Label>
							</span>
						</Header>
						<SubscribersList subscribers={subscribersList} style={styles.height}/>
					</Segment>
					<Segment>
						<Header as="h3">{UIStrings.ContentNoun}</Header>
						{ htmlToReactParser.parse(mailer.bodyHTML) }
					</Segment>
				</Segment.Group>
				</Modal.Content>
				{progressIndicator('bottom')}
			</Modal>
		)
	}
}