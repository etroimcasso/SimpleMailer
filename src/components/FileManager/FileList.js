import React, { Component, Fragment } from 'react'
import { observer, inject } from "mobx-react"
import FilesHelper from '../../helpers/FilesHelper'
const UIStrings = require('../../config/UIStrings')
const FileHelper = new FilesHelper()

export default inject("fileSystemState")(observer(class FileList extends Component {

	handleFolderOpen = (filename) => {
		//const reduceFunc = (accumulator, currentValue, index, array) => (array[index] === "/") ? accumulator : accumulator + currentValue
		const currentDirectory = this.props.fileSystemState.currentDirectory
		const newDirectory = (currentDirectory === '/') ? `/${filename}/` :`${currentDirectory}${filename}/`
		this.props.fileSystemState.setDirectory(newDirectory)
	}

	render() {

		const { fileSystemState: FileSystemState } = this.props
		const { mailerContentFiles: files, mailerContentFilesLoaded: filesLoaded, filesCount: numberOfFiles } = FileSystemState
		return(
			<Fragment>
					{(numberOfFiles > 0) ? files.map((file) => { 
						return (
								<FileListItem onFolderOpen={this.handleFolderOpen} file={file} />
							)
				}) : null}
			</Fragment>
		)
	}

}))

class FileListItem extends Component {


	render() {
		const { onFolderOpen, file } = this.props
		const fileSizeObject = FileHelper.convertFileSizeToHumanReadable(file.sizeInBytes)
		return(
			<div>
				<span>Name: {`${FileHelper.getFileName(file.name)}`}{(!file.isDir) ? `.${FileHelper.getFileExtension(file.name)}`: null}</span>
				<br />
				<span>Size: {fileSizeObject.size.toString().split('.')[0]}{fileSizeObject.unit}</span>
				<br />
				<span>Directory: {(file.isDir) ? "true" : "false"}</span>
				{ file.isDir &&
					<button  onClick={() => onFolderOpen(file.name) }>view contents</button>
				}
				<hr />
			</div>
		)
	}
}