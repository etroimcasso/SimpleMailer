import React, { Component, Fragment } from 'react'
import { Popup, Header, Divider } from 'semantic-ui-react'

export default class FileItemContextMenuPopup extends Component {

	render() {
		const { disabled, open, onClose, children, filename, trigger, } = this.props
		return (
			<Popup 
			position='right center'
			flowing
			inverted
			disabled={disabled}
			open={open} 
			onClose={onClose}
			onUnmount={onClose}
			trigger={trigger}
			hoverable={true}>
				<Header as='h3'>{filename}</Header>
				<Divider />
				{children}
				
			</Popup>
		)
	}
}
