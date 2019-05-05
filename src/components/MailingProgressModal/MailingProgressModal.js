import React, { Component } from 'react';
import { Container, Button, Icon, List, Modal, Item, Header, Transition } from 'semantic-ui-react';

import MailingProgressIndicator from './MailingProgressIndicator';
import MailerResultsList from './MailerResultsList';

const UIStrings = require('../../config/UIStrings')

export default class MailingProgressModal extends Component {

	render() {
		const {mailerResults, mailerBeingSent, totalSubscribers, open, handleConfirmClick,  } = this.props
		const emailsSent = mailerResults.length
		const allMailSent = totalSubscribers <= emailsSent


		const loadingIconSize = "large"

		return (
			<Modal
			open={open}
			basic
			dimmer="blurring" 
			inverted
			size="large"
			>
				<Modal.Header>
					{ (allMailSent ) ?
						<Icon name='check' size={loadingIconSize} />
						:
						<Icon loading name='spinner' size={loadingIconSize} />
					}
					<span style={{paddingTop: '5px'}}>{ (allMailSent) ? UIStrings.MailerModal.Completed : UIStrings.MailerModal.InProgress }</span>
				</Modal.Header>
				<MailingProgressIndicator totalSubscribers={totalSubscribers} emailsSent={emailsSent} allMailSent={allMailSent}/>
				<Modal.Content scrolling >
					<MailerResultsList items={mailerResults} />
				</Modal.Content>
				<Modal.Actions>
					<Button inverted disabled={!allMailSent} onClick={this.props.handleConfirmClick} color={(allMailSent) ? "green": null}>
					{(allMailSent) ? UIStrings.MailerModal.OKButtonText : UIStrings.MailerModal.OKButtonWaitText }
					</Button>
				</Modal.Actions>
			</Modal>
		)
	}
}
