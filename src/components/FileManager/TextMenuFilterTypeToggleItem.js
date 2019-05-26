import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react'
import { Menu, Header } from 'semantic-ui-react';

export default observer(class TextMenuFilterTypeToggleItem extends Component {

	render() {
		const { active, filterType, activeItemSize, addFilterFunction, removeFilterFunction } = this.props
		const itemText = filterType.name
		return (
			<Menu.Item
			link
			active={active}
			onClick={(!active) ? addFilterFunction : removeFilterFunction}>
				{active &&
					<Header as={activeItemSize}>
						{itemText}
					</Header>
				}
				{ !active &&
					<Fragment>
						{itemText}
					</Fragment>
				}
			</Menu.Item>
		)
	}
})