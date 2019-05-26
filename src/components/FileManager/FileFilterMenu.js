import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react'
import { Menu, Divider, Header } from 'semantic-ui-react';
import TextMenuFilterTypeToggleItem from './TextMenuFilterTypeToggleItem'
const UIStrings = require('../../config/UIStrings')

export default inject('fileManagerState')(observer(class FileFilterMenu extends Component {


	isFilterTypeEnabled = (filterType) => this.props.fileManagerState.currentFilterTypes.find((item) => item.type === filterType.type) 
	addFilter = (filterType) =>  this.props.fileManagerState.addCurrentFilterType(filterType)
	removeFilter = (filterType) => this.props.fileManagerState.removeCurrentFilterType(filterType)
	resetFilters = () => this.props.fileManagerState.getAllFilterTypes(() => null)

	render() {
		const { fileManagerState: FileManagerState } = this.props
		const { allFilterTypes, currentFilterTypes } = FileManagerState

		const headerSize = 'h4'
		const activeItemSize = 'h3'

		return(
			<Menu text vertical >
				<Menu.Header as={headerSize}>
					{UIStrings.FileManager.FilterMenu.MenuHeader}
				</Menu.Header>
				{ (allFilterTypes.length > 0) 
					? allFilterTypes.map((item) => {
						return (
							<TextMenuFilterTypeToggleItem 
								key={item}
								filterActive={this.isFilterTypeEnabled(item)}
								onClick={null}
								filterType={item}
								activeItemSize={activeItemSize}
								fileManagerState={FileManagerState}
								addFilterFunction={() => this.addFilter(item)}
								removeFilterFunction={() => this.removeFilter(item)}
							/>
						)
					})
					: null}
				<Divider horizontal />
				<Menu.Item onClick={this.resetFilters}>
					{UIStrings.FileManager.FilterMenu.ResetFiltersText}
				</Menu.Item>
			</Menu>
		)
	}
}))
