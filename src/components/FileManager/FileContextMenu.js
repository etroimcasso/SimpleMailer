import React, { Component } from 'react'
import { Menu, Divider } from 'semantic-ui-react'
import { observer, inject } from "mobx-react"
const UIStrings = require('../../config/UIStrings')


export default inject('fileManagerState')(observer(class FileContextMenu extends Component {

	render() {
		const { fileManagerState: FileManagerState, onRenameClick, onInfoClick } = this.props
		return (
				<Menu vertical text >

					{/* Get Info */}
					<Menu.Item onClick={onInfoClick}>
						{UIStrings.FileManager.ContextMenu.Information}
					</Menu.Item>
					

					{/* Rename File */}
					<Menu.Item onClick={onRenameClick}>
						{UIStrings.FileManager.ContextMenu.Rename}
					</Menu.Item>


					{/* Delete File */}
					<Menu.Item disabled link>
						{UIStrings.FileManager.ContextMenu.Delete}
					</Menu.Item>

				</Menu>
		)
	}
}))
