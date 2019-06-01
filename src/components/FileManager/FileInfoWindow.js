import React, { Component, Fragment } from 'react';
import { Form, Label, Input, Icon, Statistic, Divider } from 'semantic-ui-react';
import Cristal from 'react-cristal';

const convertUTCTimeToLocalTime = require('../../helpers/ConvertUTCTimeToLocalTime')
const formatDate = 'MMMM Do YYYY'
const formatTime = 'h:mm:ss A'
const timeFormatString = `${formatDate}[, ]${formatTime}`

const inputSize = 'mini'

export default class FileInfoWindow extends Component {

	render() {
		const { file, onClose, open } = this.props
		const { name, icon, typeName, size, color, created, accessed, modified, localPath } = file
		const titlebarText = `${name} Info`


		return (
			<Fragment>
				<Cristal title={(
					<Fragment>
						<Icon name={icon} color={color}/>
						{titlebarText}
					</Fragment>		
					)}
				isResizable={false}
				onClose={onClose}
				className='fileInfoWindow'
				>
					{/* File Size */}
					<Input size={inputSize} fluid label="Size:" value={size} />					

					{/* File Path */}
					<Input size={inputSize} fluid label="Path:" value={localPath} />

					{/* File Type */}
					<Input size={inputSize} fluid label="Type:" value={typeName} />

					<Divider fitted />

					{/* Created: */}
					<Input size={inputSize} fluid label="Created:" value={convertUTCTimeToLocalTime(created, timeFormatString)} />

					{/* Last Accessed: */}
					<Input size={inputSize} fluid label="Accessed:" value={convertUTCTimeToLocalTime(accessed, timeFormatString)} />

					{/* Last Modified: */}
					<Input size={inputSize} fluid label="Modified:" value={convertUTCTimeToLocalTime(modified, timeFormatString)} />
					
				</Cristal>
			</Fragment>
		)
	}
}