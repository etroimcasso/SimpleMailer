import React, { Component } from 'react'
import { Menu, Divider } from 'semantic-ui-react'
import { observer, inject } from "mobx-react"
const UIStrings = require('../../config/UIStrings')


export default inject('fileManagerState')(observer(class FileContextMenu extends Component {

	render() {
		const { fileManagerState: FileManagerState, onRenameClick } = this.props
		return (
				<Menu inverted vertical text size="big">

					{/* Get Info */}
					<Menu.Item disabled link>
						{UIStrings.FileManager.ContextMenu.Information}
					</Menu.Item>
					
					<Divider horizontal />

					{/* Rename File */}
					<Menu.Item onClick={onRenameClick}>
						{UIStrings.FileManager.ContextMenu.Rename}
					</Menu.Item>

					<Divider horizontal />

					{/* Delete File */}
					<Menu.Item disabled link>
						{UIStrings.FileManager.ContextMenu.Delete}
					</Menu.Item>

					<Divider horizontal />
				</Menu>
		)
	}
}))
