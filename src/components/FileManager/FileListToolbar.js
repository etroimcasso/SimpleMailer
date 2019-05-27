import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react'
import { Menu, Icon, Input, Popup, Divider } from 'semantic-ui-react';
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
		const currentFiltersCount = FileManagerState.currentFilterTypes.length
		const popupPosition = "bottom center"

		return (
			<Fragment>
				<Menu fluid icon size='large' compact>
					<Menu.Item>
						<Input>{currentDirectory}</Input>
					</Menu.Item>
				</Menu>
				<br />
				<Menu fluid icon size='large' compact>
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
					position={popupPosition}
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
					position={popupPosition}
					wide
					trigger={(
						<Menu.Item active={currentFiltersCount !== allFilterTypes.length} disabled={noFilterTypes}>
							<Icon name='filter' />
						</Menu.Item> 
						)}>
						<FileFilterMenu />
					</Popup>

					<Menu.Item>
						<Icon.Group size='large'>
							<Icon name='plus' />
						</Icon.Group>
					</Menu.Item>
				</Menu>
			</Fragment>
		)
	}
}))
