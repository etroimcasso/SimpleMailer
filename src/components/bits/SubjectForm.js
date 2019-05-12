import React, { Component } from 'react';

import { Input } from 'semantic-ui-react';

export default class SubjectForm extends Component {

	render() {
		const { handleInputChange, editorValidationState } = this.props

		const enableButton = editorValidationState && subject.length >= 3 

		return (
			<Input action fluid placeholder={UIStrings.SubjectNoun}
			action={{
				children: UIStrings.SendEmailVerb,
				onClick:() => handleSendButtonClick(editorState, subject),
				disabled: !enableButton
			}} 
				name="subject" value={subject} onChange={(event) => handleInputChange(event.target.name, event.target.value)}  
			/>

			)
	}
}