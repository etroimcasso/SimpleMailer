//This file controls the FileList. This will have the controls for the file viewer, like changing the view type from icon grid to list,
//Will basically be a quick copy of the various minimalist Linux GUI file managers
/* This should 
 	- Have buttons for changing the view type from icon grid to list view
 	- Have buttons for changing the sorting from A-Z, Z-A, Group (by file type), Date Ascend / Descend, File Size, etc 
 	- Will access the MailerContentStore for its files. Individual items in the file list will handle their own deletions. 
 	- This component's parent will handle addition of files / or the Drag and drop component will, when it is implemented
 */
import React, { Component, Fragment } from 'react'
import { observer } from "mobx-react"
import FileList from './FileList'
import MailerContentStore from '../../store/MailerContentStore'
const MailerContentState = new MailerContentStore()
const UIStrings = require('../../config/UIStrings')

export default observer(class FileListViewController extends Component {


	render() {
		const { mailerContentFiles: files, mailerContentFilesLoaded: filesLoaded } = MailerContentState
		const numberOfFiles = MailerContentState.filesCount
		return(
			<Fragment>
				<FileList />
			</Fragment>
		)
	}

})
