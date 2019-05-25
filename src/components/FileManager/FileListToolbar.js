import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react'
import { Menu, Icon, Input } from 'semantic-ui-react';
const UIStrings = require('../../config/UIStrings')


export default inject('fileManagerState')(observer(class FileListToolbar extends Component {

	sortABC = () => this.props.fileManagerState.setSortType('ABC')
	sortZYX = () => this.props.fileManagerState.setSortType('ZYX')
	sortOldest = () => this.props.fileManagerState.setSortType('OLDEST')
	sortNewest = () => this.props.fileManagerState.setSortType('NEWEST')
	sortLargest = () => this.props.fileManagerState.setSortType('LARGEST')
	sortSmallest = () => this.props.fileManagerState.setSortType('SMALLEST')
	toggleDirectoriesFirst = () => this.props.fileManagerState.toggleDirectoriesFirst()



	render() {
		const { fileManagerState: FileManagerState } = this.props
		const { pathArray, currentDirectory, directoriesFirst } = FileManagerState
		const inRootDirectory = pathArray.length === 0
		const sortType = FileManagerState.sortTypes[0]


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

					<Menu.Item
					active={sortType === 'ABC'}
					onClick={(sortType !== 'ABC') ? this.sortABC : null}
					>
						<Icon name='sort alphabet down' />
					</Menu.Item>

					<Menu.Item
					active={sortType === 'ZYX'} 
					onClick={(sortType !== 'ZYX') ? this.sortZYX : null}
					>
						<Icon name='sort alphabet up' />
					</Menu.Item>

					<Menu.Item
					active={sortType === 'OLDEST'} 
					onClick={(sortType !== 'OLDEST') ? this.sortOldest : null}
					>
						<Icon name='clock outline' />
						<Icon name='long arrow alternate up' />
					</Menu.Item>

					<Menu.Item
					active={sortType === 'NEWEST'} 
					onClick={(sortType !== 'NEWEST') ? this.sortNewest : null}
					>
						<Icon name='clock outline' />
						<Icon name='long arrow alternate down' />
					</Menu.Item>

					<Menu.Item
					active={sortType === 'SMALLEST'} 
					onClick={(sortType !== 'SMALLEST') ? this.sortSmallest : null}
					>
						<Icon name='sort numeric down' />
					</Menu.Item>

					<Menu.Item
					active={sortType === 'LARGEST'} 
					onClick={(sortType !== 'LARGEST') ? this.sortLargest : null}
					>
						<Icon name='sort numeric up' />
					</Menu.Item>			
					<Menu.Item
					active={directoriesFirst} 
					onClick={this.toggleDirectoriesFirst}
					>
						<Icon name='folder outline' />
						<Icon name='long arrow alternate down' />
					</Menu.Item>	


					<Menu.Item>
						<Input disabled>{currentDirectory}</Input>
					</Menu.Item>
			</Menu>
		)
	}
}))