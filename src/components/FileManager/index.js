//FileManager
import React, { Component, Fragment } from 'react';
import { observer, inject } from "mobx-react"
import { Container, Segment, Dimmer, Loader } from 'semantic-ui-react';
import ItemsPlaceholderSegment from '../bits/ItemsPlaceholderSegment'
import ConnectionPlaceholder from '../bits/ConnectionPlaceholder'
import FileListContainer from './FileListContainer'
import FileListToolbar from './FileListToolbar'
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
		const { fileListingLoaded: filesLoaded, filesCount: numberOfFiles, pathArray, reloadFileListingPending } = FileManagerState
		const itemCount = (numberOfFiles > 0 ) ? numberOfFiles : (pathArray.length === 0) ? 0 : 1

		return (
			<Container>
				<Segment basic>
					<Dimmer inverted active={!filesLoaded}>
						<Loader active={!filesLoaded} inline></Loader>
					</Dimmer>
					<ConnectionPlaceholder>
						<ItemsPlaceholderSegment itemCount={(reloadFileListingPending) ? 1 : itemCount} itemsLoaded={filesLoaded} noItemsText={UIStrings.NoFiles} iconName="file alternate">
							<FileListToolbar />
							<FileListContainer />
						</ItemsPlaceholderSegment>
					</ConnectionPlaceholder>
				</Segment>
			</Container>
		)
	}
}))
/*
<SubscriptionsPanelTable subscribers={files} subscribersLoaded={filesLoaded} handleSubscriberDeleteButtonClick={this.handleSubscriberDeleteButtonClick}/>
*/

//USING reloadFileListingPending in the ItemsPlaceholdeSegment ensures that the placeholder doesn't flash the "no files" screen for a split second as the next batch of new files loads.
// it does this by ensuring that, as long as the files have been loaded once, the filemanager will act as though it has files even when it briefly does not