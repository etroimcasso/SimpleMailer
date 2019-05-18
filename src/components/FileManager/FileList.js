import React, { Component, Fragment } from 'react'
import { observer } from "mobx-react"
import MailerContentStore from '../../store/MailerContentStore'
const MailerContentState = new MailerContentStore()
const UIStrings = require('../../config/UIStrings')
const FilesHelper = require('../../helpers/FilesHelper')

export default observer(class FileList extends Component {


	render() {
		const { mailerContentFiles: files, mailerContentFilesLoaded: filesLoaded } = MailerContentState
		const numberOfFiles = MailerContentState.filesCount
		return(
			<Fragment>
					{files.map((file) => <div>{`${FilesHelper.getFileName(file)}.${FilesHelper.getFileExtension(file)}`}</div>)}
			</Fragment>
		)
	}

})