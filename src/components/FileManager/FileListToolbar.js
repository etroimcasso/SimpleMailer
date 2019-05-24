import React, { Component, Fragment } from 'react';
import { observer, inject } from "mobx-react"
import { Menu, Icon } from 'semantic-ui-react';
const UIStrings = require('../../config/UIStrings')


export default inject("fileManagerState")(observer(class FileListToolbar extends Component {

	render() {
		const { fileManagerState: FileManagerState } = this.props
		const { pathArray } = FileManagerState

		const inRootDirectory = pathArray.length === 0

		return (
			<Menu icon='labeled' attached="top">
					<Menu.Item 
					disabled={inRootDirectory} 
					onClick={FileManagerState.openParentDirectory}>
						<Icon name='chevron left' /> 
						Back
					</Menu.Item>
			</Menu>
		)
	}
}))