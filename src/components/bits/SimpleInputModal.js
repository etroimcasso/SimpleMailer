import React, { Component } from 'react'
import { Modal, Input, Button} from 'semantic-ui-react'

const validateValue = (value, min, max) => value.length >= min && value.length <= max

//submitButtonFunction prop: --when called, a current value of the input is sent as the sole argument, so all functions passed to this function must have one argument
export default class SimpleInputModal extends Component {
	state = {
		value: ''
	}

	handleInputChange = (value) => this.setState({value})

	handleSubmit = () => {
		const value = this.state.value
		const min = this.props.minLength
		const max = this.props.maxLength

		if (validateValue(value, min, max)) {
			this.props.submitButtonFunction(value)
			this.setState({value: ''})
		}
	}

	handleKeyPress = (key) => {
		if (key === 'Enter') this.handleSubmit()
	}

	handleCancel = () => {
		this.setState({value: ''})
		this.props.onClose()
	} 

	render() {
		const { value } = this.state
		const { size, onClose, open, headerText, inputPlaceholder,
				submitButtonText, submitButtonFunction, cancelButtonText,
				minLength, maxLength, style } = this.props

		return (
			<Modal
			style={style}
			size={size}
			onClose={onClose}
			open={open}>
				<Modal.Header>{headerText}</Modal.Header>
				<Modal.Content>
					<Input fluid
					value={value} 
					onChange={(event) => this.handleInputChange(event.target.value)} 
					onKeyPress={(event) => this.handleKeyPress(event.key)}
					autoFocus
					placeholder={inputPlaceholder}
					/>

				</Modal.Content>						
				<Modal.Actions>
					<Button negative
						content={cancelButtonText}
						onClick={this.handleCancel}
						/>
					<Button
						positive
						content={submitButtonText}
						onClick={this.handleSubmit}
						disabled={!validateValue(value, minLength, maxLength)}
						/>
				</Modal.Actions>
			</Modal>	
		)
	}

}
