import React, { Component, Fragment } from 'react';
import { Input } from 'semantic-ui-react';
import { observer, inject } from "mobx-react"


const UIStrings = require('../../config/UIStrings');
const InputValidator = require('../../helpers/InputValidator')

/*
This crap isn't needed anymore. It was a functional programming way of getting the proper token by generating arrays from each split call, then
sorting that array of arrays from the largest array to the smallest, and taking that first array result, which would be the largest, and therefore 
the result that atually did what was needed.

//To use either space or comma as delimeter
//These will return arrays
const splitStringWithSpaces = (string) => string.split(" ")
const splitStringWithCommas = (string) => string.split(",")
const generateResultsArray = (results) => {
	//Now sort this array of objects for the one with the greatest length, since only the valid delimeter will return an array of length greater than 1
	//Then return only the [0] indexed result to get the actual thing
	//or I could just use a filter and filter away all results that are less than 2
	//Also need to check that all are not equal, because if all options are equal than there is only one email address

}
//Takes an array of arrays
const sortArrayByDescendingLength = (arrays) => {
	return arrays.sort((a, b) => {b - a })
}

const returnEmailArray = (inputString) => {

	console.log("RESULTS OBJECT")
	const resultsArray = generateResultsArray({splitStringWithSpaces(inputString), splitStringWithCommas(inputString)})

	
	console.log(resultsArray)
}

*/

//Easier way


const generateEmailsArray = (emailsString) => {
	return emailsString.split(/,| /)
}

export default inject("connectionState")(observer(class AddSubscriberForm extends Component {
	state = {
		subscriber: ""
	}

	handleInputChange = (name, value) => {
		this.setState({
			[name]: value
		})
	}

	handleSubmitClick = () => {
		const subscriber = this.state.subscriber
		const emails = generateEmailsArray(this.state.subscriber)
		
		emails.map((emailAddress) => {
			if (InputValidator.fieldIsValidEmail(emailAddress)) {
				this.props.onClick(emailAddress)
			}
		})

		this.setState({
			subscriber: ""
		})

	}

	handleKeyPress = (key) => {
		if (key === 'Enter') this.handleSubmitClick()
	}

	render() {
		const { subscriber } = this.state
		const { connectionState: ConnectionState } = this.props
		const { connection } = ConnectionState
		console.log("FUCK YOU FILE")
		console.log(connection)

		const buttonDisabled = !connection && !InputValidator.fieldIsEmpty(subscriber)

		return(
			<Fragment>
			<Input action fluid placeholder={UIStrings.SubscriptionsPanel.SubscriberEmailInputPlaceholder} icon='users' iconPosition='left'
			action={{
				content: UIStrings.AddSubscriberVerb,
				onClick: this.handleSubmitClick,
				disabled: buttonDisabled
			}} 
			name="subscriber" value={subscriber} onChange={(event) => this.handleInputChange(event.target.name, event.target.value)}  
			onKeyPress={(!buttonDisabled) ? (event) => this.handleKeyPress(event.key) : null}
			/>
			</Fragment>
		)
	}
}))