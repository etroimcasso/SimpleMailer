import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react'
import { Menu, Header } from 'semantic-ui-react';

export default observer(class TextMenuFilterTypeToggleItem extends Component {

	render() {
		const { filterActive, filterType, activeItemSize, addFilterFunction, removeFilterFunction } = this.props
		const itemText = filterType.name
		return (
			<Menu.Item
			link
			active={filterActive}
			onClick={(!filterActive) ? addFilterFunction : removeFilterFunction}>
				{filterActive &&
					<b>
						{itemText}
					</b>
				}
				{ !filterActive &&
					<Fragment>
						{itemText}
					</Fragment>
				}
			</Menu.Item>
		)
	}
})