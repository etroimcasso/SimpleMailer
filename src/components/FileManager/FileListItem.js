import React, { Component, Fragment } from 'react'
import { observer, inject } from "mobx-react"
import { Icon } from 'semantic-ui-react'
const UIStrings = require('../../config/UIStrings')

export default inject("fileSystemState")(observer(class FileListItem extends Component {


	handleDirectoryClick = () => this.props.fileSystemState.openDirectory(this.props.file.name)

	render() {
		const { fileSystemState: FileSystemState, file } = this.props


		return(
			<div>
				<span>{(file.isDir) ? <FolderIcon size="large"/> : <FileIcon size="large"/>}{`${file.name}`}</span>
				<br />
				<span>Size: {file.size}</span>
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
