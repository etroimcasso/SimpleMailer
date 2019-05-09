import React, { Component } from 'react';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import FlexView from 'react-flexview';
import openSocket from 'socket.io-client';
import { Container, Segment, Dimmer, Loader } from 'semantic-ui-react';
import SendEmailButton from './bits/SendEmailButton';
import MailingProgressModal from './MailingProgressModal/MailingProgressModal';
import SubscribersDisplay from './SubscribersDisplay';
import SubjectInput from './bits/SubjectInput';
import TopBar from './TopBar';


const hostname = require('../config/hostname.js');
const socket = openSocket(hostname.opensocket);

const UIStrings = require('../config/UIStrings');
const ReconnectionTimer = require('../helpers/ReconnectionTimer');

const convertRawEditorContentToHTML = (rawContent) => draftToHtml(rawContent)

const sendMailer = (message) => {
	socket.emit('sendMailer', message)
} 

//Loads the subscribersList state with data
const getAllSubscribers = (callback) => {
	socket.on('getAllSubscribersResult', (error, subscribers) => callback(error, subscribers))
	socket.emit('getAllSubscribers')
}

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
		//allMailSent: false,
		mailerResults: [],
		mailerProgressModalOpen: false,
		subscribersLoaded: false,
		subscribersList: [],
		connection: true,
		reloadSubscribersPending: false
	}

	componentWillMount = () => {
		this.getAllSubscribers()
	}

	componentDidMount = () => {

		socket.on('connect', () => {
			if (this.state.reloadSubscribersPending) {
				this.setState({
					subscribersList: [],
					subscribersLoaded: false
				})
				this.getAllSubscribers()
			}
			this.setState({
				connection: true,
				reloadSubscribersPending: false
			})
		})

		socket.on('disconnect', () => {
			this.setState({
				connection: false,
				reloadSubscribersPending: true
			})
		})

		socket.on('mailerSendToSubscriberResult', (error, email) => {
			this.setState({
				mailerResults: this.state.mailerResults.concat({
					email: email,
					error: error
				}),
			})
		})

		socket.on('sendMailerFinished', () => {
			this.setState({ 
				mailerBeingSent: false,
				//allMailSent: true,
			})

		})

		//Adds the new subscriber to the list
		socket.on('newSubscriberAdded', (subscriber) => {
			subscriber = JSON.parse(subscriber)
			this.setState({
				subscribersList: this.state.subscribersList.concat(subscriber)
			})
		})

		//Removes subscriber from list
		socket.on('subscriberUnsubscribed', (email) =>{
			console.log(`REMOVE ${email}`)
			this.setState({
				subscribersList: this.state.subscribersList.filter( (item) => {
					return item.email !== email
				})
			})
		})

		socket.on('noSubscribers', () => {
			this.setState({
				subscribersLoaded: true
			})
		})
		

	}

	getAllSubscribers = () => {
		//Start timer
		//When timer ends getAllSubscribers' again if subscribersLoaded is  false
		
		ReconnectionTimer(3000, () => {
			if (!this.state.subscribersLoaded) this.getAllSubscribers()
		})
		
		getAllSubscribers((error, subscribers) => {
			if (!error) {
				this.setState({
					subscribersList: JSON.parse(subscribers),
					subscribersLoaded: true
				})
			}
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

		this.setState({ 
			mailerBeingSent: true,
			mailerResults: [],
			//allMailSent: false,
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

	closeModalAndConfirmMailerSend = () => {
		this.setState({
			mailerProgressModalOpen: false,
			subject: "",
			mailerResults: [],
			editorState: EditorState.createEmpty()
		})
	}


	render() {
		const { editorState, 
				subject, 
				mailerBeingSent, 
				mailerResults, 
				//allMailSent, 
				mailerProgressModalOpen,
				subscribersList,
				subscribersLoaded,
				connection
				} = this.state


		const errors = mailerResults.filter((item) => { return item.error }).length

		const noSubscribers = subscribersList.length === 0
		const enableButton = editorState.getCurrentContent().getPlainText().length > 0 && subject.length >= 3 && connection && !noSubscribers


		return(
			<Container style={{height: '100%'}}>
				<MailingProgressModal 
				mailerResults={mailerResults} 
				mailerBeingSent={mailerBeingSent}
				totalSubscribers={subscribersList.length}
				open={mailerProgressModalOpen}
				handleConfirmClick={this.closeModalAndConfirmMailerSend}
				errors={errors}
				/>
				<Segment.Group>
					<Segment>
						<FlexView>
							<FlexView column grow>
								<SubjectInput fluid value={subject} onChange={this.handleInputChange} />
							</FlexView>
							<FlexView column style={{paddingTop: '1px' }}>
								<SendEmailButton style={styles.fullWidth} onClick={this.handleSubmitButtonClick} disabled={!enableButton} />
							</FlexView>
						</FlexView>
					</Segment>
					<Segment fluid style={styles.fullWidth}>
						<Dimmer inverted active={!subscribersLoaded}>
							<Loader active={!subscribersLoaded} inline>{UIStrings.LoadingSubscribers}</Loader>
						</Dimmer>
						<SubscribersDisplay subscribers={subscribersList} loaded={subscribersLoaded} />
					</Segment>
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
			</Container>
		)
	}
}
