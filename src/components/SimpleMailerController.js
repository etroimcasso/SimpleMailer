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
	socket.on('sendMailerResults', (error, subscriberEmail) => callback(error, subscriberEmail))
	socket.emit('sendMailer', message)
} 


// Styles
const styles = {
	solidBorder: {
		borderStyle: 'solid'
	},
	fullWidth: {
		width: '100%'
	},
}



export default class SimpleMailController extends Component {
	state = {
		editorState: EditorState.createEmpty(),
		subject: "",
		connection: false,
		mailerBeingSent: false,
		mailerResult: []
	}

	componentDidMount = () => {
		socket.on('connect', () => {
			this.setState({
				connection: true
			})
		})

		socket.on('disconnect', () => {
			this.setState({
				connection: false
			})
		})
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

		this.setState({ mailerBeingSent: true })

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
		
		sendMailer(message, (error, subscriberEmail) => {
			console.log(error)
			console.log(subscriberEmail)
			this.setState({
				mailerResult: this.state.mailerResult.concat({
					email: subscriberEmail,
					error: error
				})
			})
		})

	}

	handleInputChange = (name, value) => {
		this.setState({
			[name]: value
		})
	}

	renderMailerResults = () => {
		this.state.mailerResult.map((item) => {
			const email = item.email
			if (!item.error) {
				return (
					<div>{`Sent email to ${email}`}</div>
				)
			} else {
				return (
					<div>{`Could not email ${email}`}</div>
				)
			}
		})
	}

	render() {
		const { editorState, subject, connection, mailerBeingSent } = this.state

		const inputValid = editorState.getCurrentContent().getPlainText().length > 0 && subject.length > 3 && connection

		return(
			<Container>
				{ !connection &&
					<div>
						<NoConnectionWarning />
					</div>
				}
				<SubjectInput value={subject} style={Object.assign(styles.fullWidth)} onChange={this.handleInputChange} />
				<SendEmailButton onClick={this.handleSubmitButtonClick} disabled={!inputValid}/>
				<Container style={Object.assign(styles.solidBorder)}>
					<Editor
  					editorState={editorState}
  					toolbarClassName="toolbarClassName"
  					wrapperClassName="wrapperClassName"
  					editorClassName="editorClassName"
  					onEditorStateChange={this.onEditorStateChange}
					/>
						<div>
							{this.renderMailerResults}
						</div>
				
				</Container>
			</Container>
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

class NoConnectionWarning extends Component {
	render() {
		return (
			<span>No Network Connection</span>
		)
	}
}