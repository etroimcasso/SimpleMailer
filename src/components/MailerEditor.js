import React, { Component, Fragment } from 'react';
import { Container, Segment, Dimmer, Loader, Icon, Input, Button, Message } from 'semantic-ui-react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import openSocket from 'socket.io-client';
import FlexView from 'react-flexview';
import MailingProgressModal from './MailingProgressModal/MailingProgressModal';
import SubscribersDisplay from './SubscribersDisplay';
import { observer } from "mobx-react"
import AppStateStore from '../store/AppStateStore'
import ConnectionStateStore from '../store/ConnectionStateStore'
import SubscriberStore from '../store/SubscriberStore'
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

const SubscribersState = new SubscriberStore()
const ConnectionState = new ConnectionStateStore()
const AppState = new AppStateStore()
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


export default observer(class MailerEditor extends Component {
	state = {
		editorState: EditorState.createEmpty(),
		subject: "",
	}

	componentWillMount() {
		document.title = pageTitle
	}

	componentDidMount() {

	}

	

	onEditorStateChange = (editorState) => {
    	this.setState({
      		editorState,
    	});
    }


	handleInputChange = (name, value) => {
		this.setState({
			[name]: value
		})
	}

	closeModalAndConfirmMailerSend = () => {
	  this.setState({
	    subject: "",
	    editorState: EditorState.createEmpty()
	  })
	  AppState.clearMailerResults()
	  AppState.setMailerProgressModalOpen(false)
	  
	}

	handleSendButtonClick = (editorState, subject) => {
	  	const currentContent = editorState.getCurrentContent()
	  	const rawContent = convertToRaw(currentContent)
	  	const plainText = currentContent.getPlainText() //Plain Text
	  	const htmlText = convertRawEditorContentToHTML(rawContent)
	  	AppState.setMailerProgressModalOpen(true)


	 	AppState.clearMailerResults()

	  	const message = {
	    	senderEmail: null,
	    	senderName: null,
	    	receiverEmails: null,
	    	ccReceivers: null,
	    	bccReceivers: null,
	    	subject: subject,
	    	messageText: plainText,
	    	html: htmlText,
	   	 	attachments: null,
	    	replyTo: null
	  	}

	  	AppState.setMailerBeingSent(true)

	 	sendMailer(message,(error, email) => {
		  AppState.addMailerResult({
		          email: email,
		          error: error
		  })
		})
	}


	render() {
		const { editorState, subject } = this.state
		const { mailerProgressModalOpen, mailerBeingSent } = AppState
		const { connection } = ConnectionState
		const { subscribers: subscribersList, subscribersLoaded  } = SubscribersState
		const mailerResults = AppState.ongoingMailerResults

		const editorValid = editorState.getCurrentContent().getPlainText().length > 0
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
							onClick:() => this.handleSendButtonClick(editorState, subject),
							disabled: !enableButton
						}} 
							name="subject" value={subject} onChange={(event) => this.handleInputChange(event.target.name, event.target.value)}  />		
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
  						onEditorStateChange={this.onEditorStateChange}
						/>
					</Segment>
				</Segment.Group>
			</Fragment>
		)
	}
})
