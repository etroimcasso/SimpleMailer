import React, { Component, Fragment } from 'react'
import { observer, inject } from "mobx-react"
import FilesHelper from '../../helpers/FilesHelper'
const UIStrings = require('../../config/UIStrings')
const FileHelper = new FilesHelper()

export default inject("mailerContentState")(observer(class FileList extends Component {

	handleFolderClick = (filename) => {
		this.props.mailerContentState.setDirectory(`${this.props.mailerContentState.currentDirectory}${filename}/`)
	}


	render() {
		const { mailerContentState } = this.props
		const { mailerContentFiles: files, mailerContentFilesLoaded: filesLoaded, filesCount: numberOfFiles } = mailerContentState
		return(
			<Fragment>
					{(numberOfFiles > 0) ? files.map((file) => { 
						const fileSizeObject = FileHelper.convertFileSizeToHumanReadable(file.sizeInBytes)
						return (
							<div>
								<span>Name: {`${FileHelper.getFileName(file.name)}`}{(!file.isDir) ? `.${FileHelper.getFileExtension(file.name)}`: null}</span>
								<br />
								<span>Size: {fileSizeObject.size.toString().split('.')[0]}{fileSizeObject.unit}</span>
								<br />
								<span>Directory: {(file.isDir) ? "true" : "false"}</span>
								{ file.isDir &&
									<button onClick={() => this.handleFolderClick(file.name) }>view contents</button>
								}
								<hr />
							</div>
							)
				}) : null}
			</Fragment>
		)
	}

}))