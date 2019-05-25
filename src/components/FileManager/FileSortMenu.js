import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react'
import { Menu, Divider } from 'semantic-ui-react';
const UIStrings = require('../../config/UIStrings')

export default inject('fileManagerState')(observer(class FileSortMenu extends Component {



	sortABC = () => this.props.fileManagerState.setSortType('ABC')
	sortZYX = () => this.props.fileManagerState.setSortType('ZYX')
	sortOldest = () => this.props.fileManagerState.setSortType('OLDEST')
	sortNewest = () => this.props.fileManagerState.setSortType('NEWEST')
	sortLargest = () => this.props.fileManagerState.setSortType('LARGEST')
	sortSmallest = () => this.props.fileManagerState.setSortType('SMALLEST')
	toggleDirectoriesFirst = () => this.props.fileManagerState.toggleDirectoriesFirst()

	render() {
		const { fileManagerState: FileManagerState } = this.props
		const { directoriesFirst } = FileManagerState
		const sortType = FileManagerState.sortTypes[0]

		return(
			<Menu text vertical >
				<Menu.Header>Sort:</Menu.Header>
				<Menu.Item
				active={sortType === 'ABC'}
				onClick={(sortType !== 'ABC') ? this.sortABC : null}>
					Alphabetically
				</Menu.Item>
				<Menu.Item
				active={sortType === 'ZYX'} 
				onClick={(sortType !== 'ZYX') ? this.sortZYX : null}>
					Reverse Alphabetically
				</Menu.Item>
	
				<Menu.Item
				active={sortType === 'NEWEST'} onClick={(sortType !== 'NEWEST') ? this.sortNewest : null}>
					Newest First
				</Menu.Item>
	
				<Menu.Item
				active={sortType === 'OLDEST'} 
				onClick={(sortType !== 'OLDEST') ? this.sortOldest : null}>
					Oldest First
				</Menu.Item>
	
				<Menu.Item
				active={sortType === 'SMALLEST'} 
				onClick={(sortType !== 'SMALLEST') ? this.sortSmallest : null}>
					Smallest First
				</Menu.Item>
	
				<Menu.Item
				active={sortType === 'LARGEST'} 
				onClick={(sortType !== 'LARGEST') ? this.sortLargest : null}>
					Largest First
				</Menu.Item>
				<Divider horizontal />

				<Menu.Header>Directories First:</Menu.Header>
				<Menu.Item
				active={directoriesFirst} 
				onClick={(directoriesFirst) ? null : this.toggleDirectoriesFirst}>
					Yes
				</Menu.Item>	
				<Menu.Item
				active={!directoriesFirst} 
				onClick={(!directoriesFirst) ? null : this.toggleDirectoriesFirst}>
					No
				</Menu.Item>
			</Menu>
		)
	}
}))