import React, { Component } from 'react';
import { Progress } from 'semantic-ui-react';
import { observer } from "mobx-react"


//Needs to display progress bar of current mailer
//Progress = (100 / total subscribers) * currentSubscriberNumber
//Use the value of items.length to calculate the number of mailers sent
//const calculateProgress = (totalSubscribers, currentSubscriberNumber) => (100 / totalSubscribers) * currentSubscriberNumber
export default observer(class MailingProgressIndicator extends Component {

	render() {
		const {totalSubscribers, emailsSent, allMailSent, attached, anyError } = this.props

		//const progressPercentage = calculateProgress(totalSubscribers,emailsSent)

		return (
			<Progress 
			value={emailsSent} 
			total={totalSubscribers} 
			progress="ratio" 
			active={!allMailSent}
			success={allMailSent && !anyError}
			attached={attached} 
			color={(anyError) ? "red" : null}
			indicating={!allMailSent}
			size="large" />
		)
	}
})