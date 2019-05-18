//FileManager
import React, { Component, Fragment } from 'react';
import { observer, inject } from "mobx-react"
import { Container, Segment, Dimmer, Loader } from 'semantic-ui-react';
import ItemsPlaceholderSegment from '../bits/ItemsPlaceholderSegment'
import FileListController from './FileListController'
const UIStrings = require('../../config/UIStrings')
const FilesHelper = require('../../helpers/FilesHelper')

export default inject("mailerContentState")(observer(class FileManager extends Component {

	handleFileDeleteButton = () => {

	}

	render() {
		const { mailerContentState } = this.props
		const { mailerContentFiles: files, mailerContentFilesLoaded: filesLoaded, filesCount: numberOfFiles, currentDirectory } = mailerContentState

		return (
	
			<Segment basic>
				<Dimmer inverted active={!filesLoaded}>
					<Loader active={!filesLoaded} inline></Loader>
				</Dimmer>
				{ currentDirectory }
				<ItemsPlaceholderSegment itemCount={numberOfFiles} itemsLoaded={filesLoaded} noItemsText={UIStrings.NoFiles} iconName="file alternate">
					<FileListController />
				</ItemsPlaceholderSegment>
			</Segment>
		)
	}
}))
/*
<SubscriptionsPanelTable subscribers={files} subscribersLoaded={filesLoaded} handleSubscriberDeleteButtonClick={this.handleSubscriberDeleteButtonClick}/>
*/
