//FileManager
import React, { Component, Fragment } from 'react';
import { observer, inject } from "mobx-react"
import { Container, Segment, Dimmer, Loader, Message } from 'semantic-ui-react';
import ItemsPlaceholderSegment from '../bits/ItemsPlaceholderSegment'
import ConnectionPlaceholder from '../bits/ConnectionPlaceholder'
import FileListContainer from './FileListContainer'
import FileListToolbar from './FileListToolbar'
import UploadFileModal from './UploadFileModal'

const UIStrings = require('../../config/UIStrings')
const pageTitle = require('../../helpers/pageTitleFormatter')(UIStrings.PageTitles.FileManager);


export default inject("fileManagerState")(observer(class FileManager extends Component {

	componentWillMount() {
		document.title = pageTitle
	}

	handleFileDeleteButton = () => {

	}

	render() {
		const { fileManagerState: FileManagerState } = this.props
		const { fileListingLoaded: filesLoaded, filesCount: numberOfFiles, pathArray, reloadFileListingPending, currentErrorMessage, uploadFileModalOpen } = FileManagerState
		const itemCount = (numberOfFiles > 0 ) ? numberOfFiles : (pathArray.length === 0) ? 0 : 1 //Makes the 'Empty Directory' placeholder appear for empty directories

		return (
				<Segment basic>
					<Dimmer inverted active={!filesLoaded}>
						<Loader active={!filesLoaded} inline></Loader>
					</Dimmer>
					<UploadFileModal open={uploadFileModalOpen} />
					<ConnectionPlaceholder>
						<ItemsPlaceholderSegment itemCount={(filesLoaded) ? 1 : itemCount} itemsLoaded={filesLoaded} noItemsText={UIStrings.NoFiles} iconName="file alternate">
							{currentErrorMessage &&
								<Message negative onDismiss={FileManagerState.resetErrorMessage}>
									{currentErrorMessage}
								</Message>
							}
							<FileListToolbar />
							<FileListContainer />
						</ItemsPlaceholderSegment>
					</ConnectionPlaceholder>
				</Segment>
		)
	}
}))

//USING filesLoaded in the ItemsPlaceholdeSegment ensures that the placeholder doesn't flash the "no files" screen for a split second as the next batch of new files loads.
// it does this by ensuring that, as long as the files have been loaded once, the filemanager will act as though it has files even when it briefly does not
