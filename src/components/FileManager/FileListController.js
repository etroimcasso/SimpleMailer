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
import FileList from './FileList'
const UIStrings = require('../../config/UIStrings')

export default inject("fileSystemState")(observer(class FileListController extends Component {

	render() {
		const { fileSystemState: FileSystemState } = this.props
		const { filesCount: numberOfFiles } = FileSystemState

		const pathArray = FileSystemState.pathArray

		return(
			<Fragment>
			{ (pathArray.length > 0 ) && 
				<button onClick={FileSystemState.openParentDirectory}> Back</button>
			}
				<FileList />
			</Fragment>
		)
	}

}))
//
