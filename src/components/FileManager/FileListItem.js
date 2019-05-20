import React, { Component, Fragment } from 'react'
import { observer, inject } from "mobx-react"
import { Icon } from 'semantic-ui-react'
import FilesHelper from '../../helpers/FilesHelper'
const UIStrings = require('../../config/UIStrings')
const FileHelper = new FilesHelper()

export default inject("fileSystemState")(observer(class FileListItem extends Component {


	handleDirectoryClick = () => this.props.fileSystemState.openDirectory(this.props.file.name)





	render() {
		const { fileSystemState: FileSystemState, file } = this.props
		const fileSizeObject = FileHelper.convertFileSizeToHumanReadable(file.sizeInBytes)


		return(
			<div>
				<span>{(file.isDir) ? <FolderIcon size="large"/> : <FileIcon size="large"/>}{`${FileHelper.getFileName(file.name)}${FileHelper.getFileExtension(file.name)}`}</span>
				<br />
				<span>Size: {fileSizeObject.size.toString().split('.')[0]}{fileSizeObject.unit}</span>
				<br />
				
				{ file.isDir &&
					<button  onClick={this.handleDirectoryClick}>view contents</button>
				}
				<hr />
			</div>
		)
	}
}))

const FolderIcon = ( props = {} ) => <Icon {...props} name="folder outline" />
const FileIcon = ( props = {} ) => <Icon {...props} name="file alternate outline" />
