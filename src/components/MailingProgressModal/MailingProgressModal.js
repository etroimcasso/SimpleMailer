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
			>
				<Modal.Header>
					{ (allMailSent ) ?
						<Icon name='check' size={loadingIconSize} />
						:
						<Icon loading name='spinner' size={loadingIconSize} />
					}
					{ (allMailSent) ? UIStrings.MailerModal.Completed : UIStrings.MailerModal.InProgress }
				</Modal.Header>
				<MailingProgressIndicator totalSubscribers={totalSubscribers} emailsSent={emailsSent} allMailSent={allMailSent}/>
				<MailerResultsList items={mailerResults} />
				<Button inverted disabled={!allMailSent} onClick={this.props.handleConfirmClick} color={(allMailSent) ? "green": null}>Continue</Button>
			</Modal>
		)
	}
}
