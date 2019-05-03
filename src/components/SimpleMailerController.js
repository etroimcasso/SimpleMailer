import React, { Component } from 'react';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import openSocket from 'socket.io-client';
const hostname = require('../config/hostname.js');
const socket = openSocket(hostname.opensocket);

const convertRawEditorContentToHTML = (rawContent) => draftToHtml(rawContent)

const sendMailer = (message, callback) => {
	socket.on('sendEmailResults', results => callback(null, results))
	socket.emit('sendEmail', message)
} 


export default class SimpleMailController extends Component {
	state = {
		editorState: EditorState.createEmpty()
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
			senderEmail: "support@rx4pain.app",
			senderName: "support@rx4pain.app",
			receiverEmails: "eric.tomasso@gmail.com",
			ccReceivers: null,
			bccReceivers: null,
			subject: "Test HTML Email",
			messageText: plainText,
			html: htmlText,
			attachments: null,
			replyTo: "support@rx4pain.app"

		}
		
		sendMailer(message, (error, results) => {

		})

	}

	render() {
		const { editorState } = this.state

		return(
			<div>
				This component will handle communications with the server between the Editor and the rest
				<button onClick={this.handleSubmitButtonClick}>Send Mail</button>
				<Editor
  					editorState={editorState}
  					toolbarClassName="toolbarClassName"
  					wrapperClassName="wrapperClassName"
  					editorClassName="editorClassName"
  					onEditorStateChange={this.onEditorStateChange}
				/>
			</div>
		)
	}
}