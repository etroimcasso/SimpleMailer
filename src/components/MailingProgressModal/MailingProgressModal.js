import React, { Component } from 'react';
import { Button, Icon, Modal } from 'semantic-ui-react';
import { observer } from "mobx-react"
import MailingProgressIndicator from './MailingProgressIndicator';
import MailerResultsList from './MailerResultsList';
import SubscriberStore from '../../store/SubscriberStore'
import AppStateStore from '../../store/AppStateStore'
const AppState = new AppStateStore()
const SubscribersState = new SubscriberStore()


const UIStrings = require('../../config/UIStrings')

export default observer(class MailingProgressModal extends Component {

	render() {
		const { handleConfirmClick, open, mailerResults } = this.props

		const totalSubscribers = SubscribersState.subscriberCount
		const emailsSent = mailerResults.length
		const allMailSent = totalSubscribers <= emailsSent
		const errors = mailerResults.filter((item) => { return item.error }).length

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
					<Icon loading={!allMailSent} name={(allMailSent) ? ((anyError) ? 'exclamation' : 'check' ): 'spinner'} size={loadingIconSize} />
					<span style={{paddingTop: '5px'}}>{ (allMailSent) ? ((anyError) ? UIStrings.MailerModal.CompletedWithErrors(errors,totalSubscribers) : UIStrings.MailerModal.Completed) : UIStrings.MailerModal.InProgress }</span>
				</Modal.Header>
				<MailingProgressIndicator totalSubscribers={SubscribersState.subscriberCount} emailsSent={emailsSent} allMailSent={allMailSent} anyError={anyError}/>
				<Modal.Content scrolling >
					<MailerResultsList items={mailerResults} />
				</Modal.Content>
				<Modal.Actions>
					<Button inverted disabled={!allMailSent} onClick={handleConfirmClick} color={(allMailSent) ? ((anyError) ? "red" : "green"): null}>
						{(allMailSent) ? ((anyError) ? UIStrings.MailerModal.OKButtonFailureText(errors, totalSubscribers) : UIStrings.MailerModal.OKButtonText) : UIStrings.MailerModal.OKButtonWaitText }
					</Button>

				</Modal.Actions>
			</Modal>
		)
	}
})
