//This file controls the FileList. This will have the controls for the file viewer, like changing the view type from icon grid to list,
//Will basically be a quick copy of the various minimalist Linux GUI file managers
/* This should 
 	- Have buttons for changing the view type from icon grid to list view
 	- Have buttons for changing the sorting from A-Z, Z-A, Group (by file type), Date Ascend / Descend, File Size, etc 
 	- Will access the mailerContentState for its files. Individual items in the file list will handle their own deletions. 
 	- This component's parent will handle addition of files / or the Drag and drop component will, when it is implemented
 */
import React, { Component, Fragment } from 'react'
import { observer, inject } from "mobx-react"
import { Container, Segment } from 'semantic-ui-react'
import FileList from './FileList'
import FileInfoWindow from './FileInfoWindow'

const UIStrings = require('../../config/UIStrings')
const ConstructPathFromArray = require('../../helpers/ConstructPathFromArray')

const styles = {
	fileListFlex: {
		display: 'flex',
		flexWrap: 'wrap',
		width: '100%',
		height: '100%'
	}
}


export default inject("fileManagerState")(observer(class FileListContainer extends Component {

	closeInfoWindow = (file) => this.props.fileManagerState.closeInfoWindow(file)

	render() {
		const { fileManagerState } = this.props
		const { infoWindows } = fileManagerState
		return(
			<Container>
				{ infoWindows.map(file => 
					<FileInfoWindow onClose={() => this.closeInfoWindow(file)} file={file} />)
				}
				<Segment style={styles.fileListFlex}>
					<FileList />
				</Segment>
			</Container>
		)
	}

}))
