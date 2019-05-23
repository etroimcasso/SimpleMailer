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
		const { fileListingLoaded: filesLoaded, filesCount: numberOfFiles, pathArray } = FileManagerState
		const itemCount = (numberOfFiles > 0 ) ? numberOfFiles : (pathArray.length === 0) ? 0 : 1

		return (
			<Container>
				<Segment basic>
					<Dimmer inverted active={!filesLoaded}>
						<Loader active={!filesLoaded} inline></Loader>
					</Dimmer>
					<ConnectionPlaceholder>
						<ItemsPlaceholderSegment itemCount={itemCount} itemsLoaded={filesLoaded} noItemsText={UIStrings.NoFiles} iconName="file alternate">
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
