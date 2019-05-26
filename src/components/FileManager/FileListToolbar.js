import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react'
import { Menu, Icon, Input, Popup } from 'semantic-ui-react';
import FileSortMenu from './FileSortMenu'
import FileFilterMenu from './FileFilterMenu'
const UIStrings = require('../../config/UIStrings')


export default inject('fileManagerState')(observer(class FileListToolbar extends Component {



	render() {
		const { fileManagerState: FileManagerState } = this.props
		const { pathArray, currentDirectory, directoriesFirst, allFilterTypes } = FileManagerState
		const inRootDirectory = pathArray.length === 0
		const sortType = FileManagerState.sortTypes[0]
		const noFilterTypes = allFilterTypes.length < 1

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
					<Popup
					on='click'
					hoverable
					hideOnScroll
					trigger={(
						<Menu.Item>
							<Icon name='sort' />
						</Menu.Item> 
						)}>
						<FileSortMenu />
					</Popup>

					<Popup
					on='click'
					hoverable
					hideOnScroll
					disabled={noFilterTypes}
					wide='very'
					trigger={(
						<Menu.Item disabled={noFilterTypes}>
							<Icon name='filter' />
						</Menu.Item> 
						)}>
						<FileFilterMenu />
					</Popup>


					<Menu.Item>
						<Input disabled>{currentDirectory}</Input>
					</Menu.Item>
			</Menu>
		)
	}
}))
