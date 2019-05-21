//FileManager
import React, { Component, Fragment } from 'react';
import { observer, inject } from "mobx-react"
import { Container, Segment, Dimmer, Loader } from 'semantic-ui-react';
import ItemsPlaceholderSegment from '../bits/ItemsPlaceholderSegment'
import ConnectionPlaceholder from '../bits/ConnectionPlaceholder'
import FileListController from './FileListController'
const UIStrings = require('../../config/UIStrings')
const pageTitle = require('../../helpers/pageTitleFormatter')(UIStrings.PageTitles.FileManager);


export default inject("fileSystemState")(observer(class FileManager extends Component {

	componentWillMount() {
		document.title = pageTitle
	}

	handleFileDeleteButton = () => {

	}

	render() {
		const { fileSystemState: FileSystemState } = this.props
		const { fileListing: files, fileListingLoaded: filesLoaded, filesCount: numberOfFiles, currentDirectory, pathArray } = FileSystemState
		const itemCount = (numberOfFiles > 0 ) ? numberOfFiles : (pathArray.length === 0) ? 0 : 1

		return (
			<Container>
				<Segment basic>
					<Dimmer inverted active={!filesLoaded}>
						<Loader active={!filesLoaded} inline></Loader>
					</Dimmer>
					{ currentDirectory }
					<ConnectionPlaceholder>
						<ItemsPlaceholderSegment itemCount={itemCount} itemsLoaded={filesLoaded} noItemsText={UIStrings.NoFiles} iconName="file alternate">
							<FileListController />
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
