import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react'
import { Menu, Divider, Header } from 'semantic-ui-react';
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

		const headerSize = 'h4'
		const activeItemSize = 'h3'

		return(
			<Menu text vertical >
				<Menu.Header as={headerSize}>
					{UIStrings.FileManager.SortMenu.MenuHeader}
				</Menu.Header>

				<TextMenuSortTypeToggleItem 
				sortType={sortType} 
				expectedSortType='ABC' 
				sortFunction={this.sortABC}
				itemText={UIStrings.FileManager.SortMenu.MenuNames.Abc}
				activeItemSize={activeItemSize} />

				<TextMenuSortTypeToggleItem 
				sortType={sortType} 
				expectedSortType='ZYX' 
				sortFunction={this.sortZYX}
				itemText={UIStrings.FileManager.SortMenu.MenuNames.Zyx}
				activeItemSize={activeItemSize} />

				<TextMenuSortTypeToggleItem 
				sortType={sortType} 
				expectedSortType='NEWEST' 
				sortFunction={this.sortNewest}
				itemText={UIStrings.FileManager.SortMenu.MenuNames.Newest}
				activeItemSize={activeItemSize} />

				<TextMenuSortTypeToggleItem 
				sortType={sortType} 
				expectedSortType='OLDEST' 
				sortFunction={this.sortOldest}
				itemText={UIStrings.FileManager.SortMenu.MenuNames.Oldest}
				activeItemSize={activeItemSize} />

				<TextMenuSortTypeToggleItem 
				sortType={sortType} 
				expectedSortType='SMALLEST' 
				sortFunction={this.sortSmallest}
				itemText={UIStrings.FileManager.SortMenu.MenuNames.Smallest}
				activeItemSize={activeItemSize} />

				<TextMenuSortTypeToggleItem 
				sortType={sortType} 
				expectedSortType='LARGEST' 
				sortFunction={this.sortLargest}
				itemText={UIStrings.FileManager.SortMenu.MenuNames.Largest}
				activeItemSize={activeItemSize} />	

				<Divider horizontal />

				<Menu.Header as={headerSize}>
					Directories First:
				</Menu.Header>
				<Menu.Item
				active={directoriesFirst} 
				onClick={(directoriesFirst) ? null : this.toggleDirectoriesFirst}>
					{directoriesFirst &&
						<Header as={activeItemSize}>
							{ UIStrings.FileManager.SortMenu.MenuNames.DirectoriesFirst.Yes }
						</Header>
					}
					{ !directoriesFirst &&
						<Fragment>
							{ UIStrings.FileManager.SortMenu.MenuNames.DirectoriesFirst.Yes }
						</Fragment>
					}
				</Menu.Item>	
				<Menu.Item
				active={!directoriesFirst} 
				onClick={(!directoriesFirst) ? null : this.toggleDirectoriesFirst}>
					{!directoriesFirst &&
						<Header as={activeItemSize}>
							{ UIStrings.FileManager.SortMenu.MenuNames.DirectoriesFirst.No }
						</Header>
					}
					{ directoriesFirst &&
						<Fragment>
							{ UIStrings.FileManager.SortMenu.MenuNames.DirectoriesFirst.No }
						</Fragment>
					}
				</Menu.Item>
			</Menu>
		)
	}
}))

const TextMenuSortTypeToggleItem = (props) => (
	<Menu.Item
	active={props.sortType === props.expectedSortType}
	onClick={(props.sortType !== props.expectedSortType) ? props.sortFunction : null}>
		{props.sortType === props.expectedSortType &&
			<Header as={props.activeItemSize}>
				{props.itemText}
			</Header>
		}
		{ props.sortType !== props.expectedSortType &&
			<Fragment>
				{props.itemText}
			</Fragment>
		}
	</Menu.Item>
	)