import React, { Component } from 'react';

import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import FlexView from 'react-flexview';
import { Container, Segment, Dimmer, Loader } from 'semantic-ui-react';
import SendEmailButton from './bits/SendEmailButton';
import MailingProgressModal from './MailingProgressModal/MailingProgressModal';
import SubscribersDisplay from './SubscribersDisplay';
import SubjectInput from './bits/SubjectInput';

const UIStrings = require('../config/UIStrings');




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

	componentWillMount = () => {
		
	}

	componentDidMount = () => {

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
				connection,
				handleSendButtonClick } = this.props



		const errors = mailerResults.filter((item) => { return item.error }).length

		const noSubscribers = subscribersList.length === 0
		const enableButton = editorState.getCurrentContent().getPlainText().length > 0 && subject.length >= 3 && connection && !noSubscribers


		return(
			<Container style={{height: '100%'}}>
				<MailingProgressModal 
				mailerResults={mailerResults} 
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
								<SendEmailButton style={styles.fullWidth} onClick={() => handleSendButtonClick(editorState, subject)} disabled={!enableButton} />
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
