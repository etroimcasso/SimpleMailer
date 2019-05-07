import React, { Component } from 'react';
import { Container, Button, Icon, List, Modal, Item, Header, Transition } from 'semantic-ui-react';

import MailingProgressIndicator from './MailingProgressIndicator';
import MailerResultsList from './MailerResultsList';

const UIStrings = require('../../config/UIStrings')

export default class MailingProgressModal extends Component {

	render() {
		const {mailerResults, mailerBeingSent, totalSubscribers, open, handleConfirmClick, errors  } = this.props
		const emailsSent = mailerResults.length
		const allMailSent = totalSubscribers <= emailsSent

		const anyError = errors > 0



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
					<Icon name={(allMailSent) ? ((anyError) ? 'exclamation' : 'check' ): 'spinner'} size={loadingIconSize} />
					<span style={{paddingTop: '5px'}}>{ (allMailSent) ? ((anyError) ? UIStrings.MailerModal.CompletedWithErrors(errors,totalSubscribers) : UIStrings.MailerModal.Completed) : UIStrings.MailerModal.InProgress }</span>
				</Modal.Header>
				<MailingProgressIndicator totalSubscribers={totalSubscribers} emailsSent={emailsSent} allMailSent={allMailSent} anyError={anyError}/>
				<Modal.Content scrolling >
					<MailerResultsList items={mailerResults} />
				</Modal.Content>
				<Modal.Actions>
					<Button inverted disabled={!allMailSent} onClick={this.props.handleConfirmClick} color={(allMailSent) ? ((anyError) ? "red" : "green"): null}>
						{(allMailSent) ? ((anyError) ? UIStrings.MailerModal.OKButtonFailureText(errors, totalSubscribers) : UIStrings.MailerModal.OKButtonText) : UIStrings.MailerModal.OKButtonWaitText }
					</Button>

				</Modal.Actions>
			</Modal>
		)
	}
}
