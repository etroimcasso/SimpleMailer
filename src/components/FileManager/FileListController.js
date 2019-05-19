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

	goToParentDirectory = () => {
		const pathArray = this.props.fileSystemState.pathArray
		const reduceFunc = (accumulator, currentValue, index, array) => (index >= array.length - 1) ? accumulator : `${accumulator}${currentValue}/`
		
		const newDirectory = pathArray.reduce(reduceFunc, '/')
		console.log(`New directory: ${newDirectory}`)
		console.log('pathArray')
		console.log(pathArray)

		this.props.fileSystemState.setDirectory(newDirectory)
	}

	render() {
		const { fileSystemState: FileSystemState } = this.props
		const { filesCount: numberOfFiles } = FileSystemState

		const pathArray = FileSystemState.pathArray
		console.log(pathArray)

		return(
			<Fragment>
			{ (pathArray.length > 0 ) && 
				<button onClick={this.goToParentDirectory}> Back</button>
			}
				<FileList />
			</Fragment>
		)
	}

}))
//
