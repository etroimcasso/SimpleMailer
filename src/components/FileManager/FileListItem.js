import React, { Component, Fragment } from 'react'
import { observer, inject } from "mobx-react"
import FilesHelper from '../../helpers/FilesHelper'
const UIStrings = require('../../config/UIStrings')
const FileHelper = new FilesHelper()

export default inject("fileSystemState")(observer(class FileListItem extends Component {


	render() {
		const { fileSystemState: FileSystemState, file } = this.props
		const fileSizeObject = FileHelper.convertFileSizeToHumanReadable(file.sizeInBytes)
		return(
			<div>
				<span>Name: {`${FileHelper.getFileName(file.name)}`}{(!file.isDir) ? `.${FileHelper.getFileExtension(file.name)}`: null}</span>
				<br />
				<span>Size: {fileSizeObject.size.toString().split('.')[0]}{fileSizeObject.unit}</span>
				<br />
				<span>Directory: {(file.isDir) ? "true" : "false"}</span>
				{ file.isDir &&
					<button  onClick={() => FileSystemState.openDirectory(file.name) }>view contents</button>
				}
				<hr />
			</div>
		)
	}
}))