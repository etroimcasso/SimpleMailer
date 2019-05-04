import React, { Component } from 'react';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import FlexView from 'react-flexview';
import openSocket from 'socket.io-client';

import { Container, Input, Segment } from 'semantic-ui-react';
import SendEmailButton from './bits/SendEmailButton';
import MailingProgressModal from './MailingProgressModal'


const hostname = require('../config/hostname.js');
const socket = openSocket(hostname.opensocket);

const convertRawEditorContentToHTML = (rawContent) => draftToHtml(rawContent)

const sendMailer = (message) => {
	socket.emit('sendMailer', message)
} 

/*
const getSubscriberCount = (callback) => {
	socket.on('getSubscriberCountResult', (error, count) => callback(error ,count))
	socket.emit('getSubscriberCount')
}
*/

// Styles
const styles = {
	solidBorder: {
		borderStyle: 'solid'
	},
	fullWidth: {
		width: '100%'
	},
	fullHeight: {
		height: '100%'
	},
}



export default class SimpleMailController extends Component {
	state = {
		editorState: EditorState.createEmpty(),
		subject: "",
		mailerBeingSent: false,
		allMailSent: false,
		mailerResults: [],
		totalSubscribers: 0,
		currentSubscriberNumber: 0,
		mailerProgressModalOpen: false,
	}

	componentDidMount = () => {
		

		socket.on('mailerSendToSubscriberResult', (error, email, totalSubscribers, currentSubscriberNumber) => {
			this.setState({
				mailerResults: this.state.mailerResults.concat({
					email: email,
					error: error
				}),
				totalSubscribers: totalSubscribers,
				currentSubscriberNumber: currentSubscriberNumber,
			})
		})
		socket.on('sendMailerFinished', () => {
			this.setState({ 
				mailerBeingSent: false,
				allMailSent: true,
			})

		})
		/*
		getSubscriberCount((error, count) => {
			if (!error) {

			}
		})
		*/

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

		this.setState({ 
			mailerBeingSent: true,
			mailerResults: [],
			allMailSent: false,
			currentSubscriberNumber: 0,
			mailerProgressModalOpen: true
			 })

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

		})

	}

	handleInputChange = (name, value) => {
		this.setState({
			[name]: value
		})
	}


	render() {
		const { editorState, 
				subject, 
				mailerBeingSent, 
				mailerResults, 
				allMailSent, 
				mailerProgressModalOpen,
				totalSubscribers, 
				currentSubscriberNumber, } = this.state

		const { connection } = this.props

		const inputValid = editorState.getCurrentContent().getPlainText().length > 0 && subject.length > 3 && connection

		return(
				<Container style={{height: '100%'}}>
					<MailingProgressModal 
					mailerResults={mailerResults} 
					mailerBeingSent={mailerBeingSent}
					allMailSent={allMailSent}
					totalSubscribers={totalSubscribers}
					currentSubscriberNumber={currentSubscriberNumber}
					open={mailerProgressModalOpen}
					 />
					<FlexView>
						<FlexView column grow>
							<SubjectInput fluid value={subject} onChange={this.handleInputChange} />
						</FlexView>
						<FlexView column style={{paddingTop: '1px' }}>
							<SendEmailButton style={styles.fullWidth} onClick={this.handleSubmitButtonClick} disabled={!inputValid} />
						</FlexView>
					</FlexView>
					<Segment style={styles.fullHeight}>
						<Editor
  						editorState={editorState}
  						toolbarClassName="editorToolbar"
  						wrapperClassName="editorWrapper"
  						editorClassName="editorEditor"
  						onEditorStateChange={this.onEditorStateChange}
						/>
					</Segment>
				</Container>
		)
	}
}

class SubjectInput extends Component {
	render() {
		const { value, onChange, style, fluid } = this.props
		return (
			<Input fluid={fluid} label="Subject" name="subject" value={value} style={style} onChange={(event) => onChange(event.target.name, event.target.value)} />
		)
	}
}

