import React, { Component } from 'react';
import { Container, Button, Icon, List, Modal, Item, Header, Transition } from 'semantic-ui-react';

import MailingProgressIndicator from './MailingProgressIndicator';
import MailerResultsList from './MailerResultsList';


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
			dimmer="blurring" >
				<Modal.Header>
					{ (allMailSent ) ? 
						<Icon name='check' size={loadingIconSize} />
						:
						<Icon loading name='spinner' size={loadingIconSize} />
					}
					Sending Mailer
				</Modal.Header>
				<MailingProgressIndicator totalSubscribers={totalSubscribers} emailsSent={emailsSent} allMailSent={allMailSent}/>
				<MailerResultsList items={mailerResults} />
				<Button disabled={!allMailSent} onClick={this.props.handleConfirmClick}>Continue</Button>
			</Modal>
		)
	}
}
