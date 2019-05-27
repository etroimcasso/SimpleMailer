import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react'
import { Menu, Divider, Header } from 'semantic-ui-react';
import TextMenuFilterTypeToggleItem from './TextMenuFilterTypeToggleItem'
const UIStrings = require('../../config/UIStrings')

export default inject('fileManagerState')(observer(class FileFilterMenu extends Component {


	isFilterTypeEnabled = (filterType) => this.props.fileManagerState.currentFilterTypes.find((item) => item.type === filterType.type) 
	addFilter = (filterType) =>  this.props.fileManagerState.addCurrentFilterType(filterType)
	removeFilter = (filterType) => this.props.fileManagerState.removeCurrentFilterType(filterType)
	resetFilters = () => this.props.fileManagerState.resetCurrentFilterTypes()
	filterOutAll = () => this.props.fileManagerState.filterOutAll()

	render() {
		const { fileManagerState: FileManagerState } = this.props
		const { allFilterTypes, currentFilterTypes } = FileManagerState
		const showAllActive = currentFilterTypes.length === allFilterTypes.length
		const hideAllActive = currentFilterTypes.length === 0

		const headerSize = 'h5'
		const activeItemSize = 'h4'

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
								addFilterFunction={() => this.addFilter(item)}
								removeFilterFunction={() => this.removeFilter(item)}
							/>
						)
					})
					: null}

				<Divider fitted horizontal />

				<ShowOrHideMenuItem 
				active={showAllActive} 
				activeItemSize={activeItemSize}
				onClick={this.resetFilters} 
				text={UIStrings.FileManager.FilterMenu.ResetFiltersText}
				/>

				<ShowOrHideMenuItem 
				active={hideAllActive} 
				activeItemSize={activeItemSize}
				onClick={this.filterOutAll} 
				text={UIStrings.FileManager.FilterMenu.FilterOutAllText}
				/>
			</Menu>
		)
	}
}))

const ShowOrHideMenuItem = (props) => (
	<Menu.Item active={props.active} onClick={props.onClick}>
	{ props.active &&
		<b>{props.text}</b>
	}
	{ !props.active &&
		<Fragment>
			{props.text}
		</Fragment>
	}
	</Menu.Item>
)

//Keep in mind that this function requires an "extra props" function to also be passed to the AutomaticGrid component this is passed to
/*
const generateTextMenuFilterTypeToggleItem = (props) => {

	return (
		<TextMenuFilterTypeToggleItem 
			key={props.key}
			filterActive={props.filterActive}
			onClick={props.onClick}
			filterType={props.filterType}
			activeItemSize={props.activeItemSize}
			addFilterFunction={props.addFilter}
			removeFilterFunction={props.removeFilter}
		/>
	)
}
*/
//This will take an array of items, a 'number of items per column' value, and a function for creating an element from the array of items given to it
//For every 'number of items per column' items, create another column
////Extra Props function should be a function that can be passed in a map that will return a props object that contains the props needed for making the componentFunction work
////These extra props will combined with the generated propsObject inside each items.map function to provide the componentFunction with its props
//<AutomaticGrid items={allFilterTypes} contentFunction={generateTextMenuFilterTypeToggleItem} extraPropsFunction={() => generateExtraPropsForTextMenuFilterTypeToggleItem(currentFilterTypes)}
/*
const AutomaticGrid = (props) => {
	const { items, extraPropsFunction, componentFunction } = this.props

	return (
		<Fragment>
		{items.map((item) => {

		})}
		</Fragment>


	)
	(allFilterTypes.length > 0) 
						? allFilterTypes.map((item) => {
							return ()
						})
						: null}
}
*/