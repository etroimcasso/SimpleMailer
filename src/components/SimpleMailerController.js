import React, { Component } from 'react';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import openSocket from 'socket.io-client';

import { Container, Button, Icon, Input } from 'semantic-ui-react';

const hostname = require('../config/hostname.js');
const socket = openSocket(hostname.opensocket);

const convertRawEditorContentToHTML = (rawContent) => draftToHtml(rawContent)

const sendMailer = (message, callback) => {
	socket.on('sendEmailResults', results => callback(null, results))
	socket.emit('sendMailer', message)
} 



// Styles
const editorContainerStyle = {
	borderStyle: 'solid'
}

export default class SimpleMailController extends Component {
	state = {
		editorState: EditorState.createEmpty(),
		subject: ""
	}

	componentDidMount = () => {
	}

	 onEditorStateChange = (editorState) => {
    	this.setState({
      		editorState,
    	});
    }

	handleSubmitButtonClick = () => {
		const currentContent = this.state.editorState.getCurrentContent()
		const rawContent = convertToRaw(currentContent)
		const plainText = currentContent.getPlainText() //Plain Text
		const htmlText = convertRawEditorContentToHTML(rawContent)

		const message = {
			senderEmail: null,
			senderName: null,
			receiverEmails: null,
			ccReceivers: null,
			bccReceivers: null,
			subject: this.state.subject,
			messageText: plainText,
			html: htmlText,
			attachments: null,
			replyTo: null

		}
		
		sendMailer(message, (error, results) => {
		})

	}

	handleInputChange = (name, value) => {
		this.setState({
			[name]: value
		})
	}

	render() {
		const { editorState, subject } = this.state

		const inputValid = (editorState.getCurrentContent().getPlainText().length > 0 && subject.length > 3)

		return(
			<div>
				This component will handle communications with the server between the Editor and the rest
				<SubjectInput value={subject} onChange={this.handleInputChange} />
				<SendEmailButton onClick={this.handleSubmitButtonClick} disabled={!inputValid}/>
				<Container style={editorContainerStyle}>
					<Editor
  					editorState={editorState}
  					toolbarClassName="toolbarClassName"
  					wrapperClassName="wrapperClassName"
  					editorClassName="editorClassName"
  					onEditorStateChange={this.onEditorStateChange}
					/>
				</Container>
			</div>
		)
	}
}

class SendEmailButton extends Component {
	render() {
		const { disabled } = this.props
		return(
			<Button icon labelPosition='right' onClick={this.props.onClick} disabled={disabled}>
				<Icon name="send" />
				Send Mailer
			</Button>
		)


	}
}

class SubjectInput extends Component {
	render() {
		const { value, onChange } = this.props
		return (
			<Input label="Subject" name="subject" value={value} onChange={(event) => this.props.onChange(event.target.name, event.target.value)} />
		)
	}
}