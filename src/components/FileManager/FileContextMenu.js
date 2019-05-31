import React, { Component } from 'react'
import { Menu, Divider } from 'semantic-ui-react'
import { observer, inject } from "mobx-react"

const UIStrings = require('../../config/UIStrings')

const styles = {
	topLayer: {
		//position: 'absolute !important',
		//zIndex: '-1 !important'
	}
}

export default inject('fileManagerState')(observer(class FileContextMenu extends Component {

	render() {
		const { fileManagerState: FileManagerState, onRenameClick } = this.props
		return (
				<Menu inverted vertical text size="big">
					<Menu.Item link>{UIStrings.FileManager.ContextMenu.Information}</Menu.Item>
					<Divider horizontal />
					<Menu.Item onClick={onRenameClick}>
						{UIStrings.FileManager.ContextMenu.Rename}
					</Menu.Item>
					<Divider horizontal />
					<Menu.Item link>{UIStrings.FileManager.ContextMenu.Delete}</Menu.Item>
					<Divider horizontal />
				</Menu>
		)
	}
}))
