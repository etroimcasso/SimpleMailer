//FileManager
import React, { Component, Fragment } from 'react';
import { observer } from "mobx-react"
import { Container, Segment, Dimmer, Loader } from 'semantic-ui-react';
import MailerContentStore from '../../store/MailerContentStore'
import ItemsPlaceholderSegment from '../bits/ItemsPlaceholderSegment'
import FileListViewController from './FileListViewController'
const MailerContentState = new MailerContentStore()
const UIStrings = require('../../config/UIStrings')
const FilesHelper = require('../../helpers/FilesHelper')

export default observer(class FileManager extends Component {

	handleFileDeleteButton = () => {

	}

	render() {
		const { mailerContentFiles: files, mailerContentFilesLoaded: filesLoaded } = MailerContentState
		const numberOfFiles = MailerContentState.filesCount

		return (
		
			<Segment basic>
				<Dimmer inverted active={!filesLoaded}>
					<Loader active={!filesLoaded} inline></Loader>
				</Dimmer>
				<ItemsPlaceholderSegment itemCount={numberOfFiles} itemsLoaded={filesLoaded} noItemsText={UIStrings.NoFiles} iconName="file alternate">
					<FileListViewController />
				</ItemsPlaceholderSegment>
			</Segment>
		)
	}
})
/*
<SubscriptionsPanelTable subscribers={files} subscribersLoaded={filesLoaded} handleSubscriberDeleteButtonClick={this.handleSubscriberDeleteButtonClick}/>
*/
