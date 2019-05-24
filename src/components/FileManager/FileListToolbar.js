import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react'
import { Menu, Icon, Input } from 'semantic-ui-react';
const UIStrings = require('../../config/UIStrings')


export default inject('fileManagerState')(observer(class FileListToolbar extends Component {

	render() {
		const { fileManagerState: FileManagerState } = this.props
		const { pathArray, currentDirectory } = FileManagerState

		const inRootDirectory = pathArray.length === 0


		return (
			<Menu icon attached='top' size='large' compact>
					<Menu.Item 
					disabled={inRootDirectory} 
					onClick={FileManagerState.openParentDirectory}>
						<Icon name='chevron left' /> 
					</Menu.Item>
					<Menu.Item
					disabled={inRootDirectory}
					onClick={FileManagerState.resetDirectory}>
						<Icon name='home' />
					</Menu.Item>
					<Menu.Item>
						<Input disabled>{currentDirectory}</Input>
					</Menu.Item>
			</Menu>
		)
	}
}))