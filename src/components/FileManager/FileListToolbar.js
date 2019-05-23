import React, { Component, Fragment } from 'react';
import { observer, inject } from "mobx-react"
import { Menu, Icon } from 'semantic-ui-react';
const UIStrings = require('../../config/UIStrings')


export default inject("fileSystemState")(observer(class FileListToolbar extends Component {

	render() {
		const { fileSystemState: FileSystemState } = this.props
		const { pathArray } = FileSystemState

		const inRootDirectory = pathArray.length === 0

		return (
			<Menu>
					<button disabled={inRootDirectory} onClick={FileSystemState.openParentDirectory}> Back</button>
			</Menu>
		)
	}
}))