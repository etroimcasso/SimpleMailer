//FileManager
import React, { Component, Fragment } from 'react';
import { observer } from "mobx-react"
import MailerContentStore from '../../store/MailerContentStore'
const MailerContentState = new MailerContentStore()

export default observer(class FileManager extends Component {

	render() {
		const { mailerContentFiles: files, mailerContentFilesLoaded: filesLoaded } = MailerContentStore
		const numberOfFiles = MailerContentStore.filesCount

		return (
			<Fragment>
				<span>NUMBER OF FILES: { numberOfFiles }</span>
			</Fragment>
		)
	}
})

