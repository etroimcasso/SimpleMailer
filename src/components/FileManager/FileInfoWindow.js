import React, { Component, Fragment } from 'react';
import { Form, Label, Input, Icon, Statistic, Divider } from 'semantic-ui-react';
import Cristal from 'react-cristal';

const inputSize = 'small'

export default class FileInfoWindow extends Component {

	render() {
		const { file, onClose, open, path } = this.props
		const { name, icon, typeName, size } = file
		const localPath = `${path}${file.name}`
		const absolutePath = file.path
		const titlebarText = `${name} Info`


		return (
			<Fragment>
				<Cristal title={(
					<Fragment>
						<Icon name={icon} />
						{titlebarText}
					</Fragment>		
					)}
				isResizeable={false}
				onClose={onClose}>
					{/* File Size */}
					<Input size={inputSize} fluid label="Size::" value={size} />
					{/* File Path */}
					<Input size={inputSize} fluid label="Path:" value={path} />
					{/* File Type */}
					<Input size={inputSize} fluid label="Type:" value={typeName} />

				</Cristal>
			</Fragment>
		)
	}
}