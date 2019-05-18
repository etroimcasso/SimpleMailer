import React, { Component, Fragment } from 'react'
import { observer } from "mobx-react"
import MailerContentStore from '../../store/MailerContentStore'
import FilesHelper from '../../helpers/FilesHelper'
const MailerContentState = new MailerContentStore()
const UIStrings = require('../../config/UIStrings')
const FileHelper = new FilesHelper()

export default observer(class FileList extends Component {


	render() {
		const { mailerContentFiles: files, mailerContentFilesLoaded: filesLoaded } = MailerContentState
		const numberOfFiles = MailerContentState.filesCount
		return(
			<Fragment>
					{(files.length > 0) ? files.map((file) => { 
						const fileSizeObject = FileHelper.convertFileSizeToHumanReadable(file.sizeInBytes)
						console.log(fileSizeObject)
						return (<div>{`${FileHelper.getFileName(file.name)}.${FileHelper.getFileExtension(file.name)}: ${fileSizeObject.size.toString().split('.')[0]}${fileSizeObject.unit}`}</div>)
				}) : null}
			</Fragment>
		)
	}

})