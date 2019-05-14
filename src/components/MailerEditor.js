import React, { Component, Fragment } from 'react';
import { Container, Segment, Dimmer, Loader, Icon, Input, Button, Message } from 'semantic-ui-react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import FlexView from 'react-flexview';
import MailingProgressModal from './MailingProgressModal/MailingProgressModal';
import SubscribersDisplay from './SubscribersDisplay';
import { observer } from "mobx-react"
import ConnectionStateStore from '../store/ConnectionStateStore'
const ConnectionState = new ConnectionStateStore()

const UIStrings = require('../config/UIStrings');
const pageTitle = require('../helpers/pageTitleFormatter')(UIStrings.PageTitles.NewMailer);

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



export default class MailerEditor extends Component {
	state = {
		editorState: EditorState.createEmpty(),
		subject: "",
	}

	componentWillMount() {
		document.title = pageTitle
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
	  this.props.handleModalClose()
	}

	render() {
		const { editorState, subject } = this.state
		const {  mailerResults, 
				mailerProgressModalOpen,
				subscribersList,
				subscribersLoaded,
				handleSendButtonClick } = this.props
		const { connection } = ConnectionState



		const errors = mailerResults.filter((item) => { return item.error }).length

		const noSubscribers = subscribersList.length === 0
		const editorValid = editorState.getCurrentContent().getPlainText().length > 0
		const subjectValid = subject.length >= 3

		const enableButton = editorValid && subjectValid && connection && !noSubscribers


		return(
			<Fragment>
				<MailingProgressModal 
				mailerResults={mailerResults} 
				totalSubscribers={subscribersList.length}
				open={mailerProgressModalOpen}
				handleConfirmClick={this.closeModalAndConfirmMailerSend}
				errors={errors}
				/>
				<Segment.Group>
					<Segment>
						<Input action fluid placeholder={UIStrings.SubjectNoun} icon='quote left' iconPosition='left'
						action={{
							content: UIStrings.SendEmailVerb,
							onClick:() => handleSendButtonClick(editorState, subject),
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
}
