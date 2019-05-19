import React, { Component, Fragment } from 'react';
import { Container, Segment, Dimmer, Loader, Icon, Input, Button, Message } from 'semantic-ui-react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import openSocket from 'socket.io-client';
import FlexView from 'react-flexview';
import MailingProgressModal from './MailingProgressModal/MailingProgressModal';
import SubscribersDisplay from './SubscribersDisplay';
import { observer, inject } from "mobx-react"
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
const UIStrings = require('../config/UIStrings');
const pageTitle = require('../helpers/pageTitleFormatter')(UIStrings.PageTitles.NewMailer);
const convertRawEditorContentToHTML = (rawContent) => draftToHtml(rawContent)
const hostname = require('../config/hostname.js');
const socket = openSocket(hostname.opensocket);

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

const sendMailer = (message, callback) => {
	socket.on('mailerSendToSubscriberResult', (error, email) => callback(error, email)) 
  	socket.emit('sendMailer', message)
} 


export default inject("appState", "connectionState", "subscriberState")(observer(class MailerEditor extends Component {
	
	componentWillMount() {
		document.title = pageTitle
	}

	componentDidMount() {

	}

	

	handleInputChange = (name, value) => {
		this.setState({
			[name]: value
		})
	}

	closeModalAndConfirmMailerSend = () => {
	  this.props.appState.setSubject("")
	  this.props.appState.setEditorState(EditorState.createEmpty())
	  this.props.appState.clearMailerResults()
	  this.props.appState.setMailerProgressModalOpen(false)
	}

	handleSendButtonClick = () => {
	  	this.props.appState.setMailerProgressModalOpen(true)
	 	this.props.appState.clearMailerResults()

	  	const message = {
	    	senderEmail: null,
	    	senderName: null,
	    	receiverEmails: null,
	    	ccReceivers: null,
	    	bccReceivers: null,
	    	subject: this.props.appState.getSubject,
	    	messageText: this.props.appState.plainTextContent,
	    	html: this.props.appState.htmlContent,
	   	 	attachments: null,
	    	replyTo: null
	  	}

	  	this.props.appState.setMailerBeingSent(true)

	 	sendMailer(message,(error, email) => {
		  this.props.appState.addMailerResult({
		          email: email,
		          error: error
		  })
		})
	}


	render() {
		const { appState: AppState, connectionState: ConnectionState, subscriberState: SubscribersState } = this.props
		const { mailerProgressModalOpen, mailerBeingSent, getSubject: subject, editorStateObject: editorState } = AppState
		const { connection } = ConnectionState
		const { subscribers: subscribersList, subscribersLoaded  } = SubscribersState
		const mailerResults = AppState.ongoingMailerResults

		const editorValid = AppState.plainTextContent.length > 0
		const subjectValid = subject.length >= 3

		const enableButton = editorValid && subjectValid && connection && SubscribersState.subscriberCount > 0


		return(
			<Fragment>
				<MailingProgressModal 
					handleConfirmClick={this.closeModalAndConfirmMailerSend}
					open={mailerProgressModalOpen}
					mailerResults={mailerResults}
				/>
				<Segment.Group>
					<Segment>
						<Input action fluid placeholder={UIStrings.SubjectNoun} icon='quote left' iconPosition='left'
						action={{
							content: UIStrings.SendEmailVerb,
							onClick:() => this.handleSendButtonClick(),
							disabled: !enableButton
						}} 
							name="subject" value={subject} onChange={(event) => AppState.setSubject(event.target.value)}  />		
					</Segment>
					{ false &&
					<Segment fluid style={styles.fullWidth}>
						<Dimmer inverted active={!subscribersLoaded}>
							<Loader active={!subscribersLoaded} inline>{UIStrings.LoadingSubscribers}</Loader>
						</Dimmer>

						 	<SubscribersDisplay subscribers={subscribersList} loaded={subscribersLoaded} /> 
					</Segment>
					}
					<Segment style={styles.fullHeight}>
						<Editor
  						editorState={editorState}
  						toolbarClassName="editorToolbar"
  						wrapperClassName="editorWrapper"
  						editorClassName="editorEditor"
  						onEditorStateChange={(change) => AppState.setEditorState(change)}
						/>
					</Segment>
				</Segment.Group>
			</Fragment>
		)
	}
}))
