import React, { Component, Fragment } from 'react';
import { Form, Label, Input, Icon, Statistic, Divider, Header } from 'semantic-ui-react';
import Cristal from 'react-cristal';

const UIStrings = require('../../config/UIStrings')
const convertUTCTimeToLocalTime = require('../../helpers/ConvertUTCTimeToLocalTime')
const formatDate = 'MMMM Do YYYY'
const formatTime = 'h:mm:ss A'
const timeFormatString = `${formatDate}[, ]${formatTime}`

const inputSize = 'mini'

const styles = {
	labelWidth: {
		width: '68px'
	},
	header: {
		marginBottom: '5px'

	}
}

export default class FileInfoWindow extends Component {

	render() {
		const { file, onClose, open, initialPosition } = this.props
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
				initialPosition={initialPosition}
				>

					<SectionHeader style={{marginTop: '-6px'}} text={UIStrings.FileManager.FileInfoWindow.Headers.GeneralInfo} />

					{/* File Size */}
					<InfoField label={UIStrings.FileManager.FileInfoWindow.Fields.Name} value={name} />

					{/* File Size */}
					<InfoField label={UIStrings.FileManager.FileInfoWindow.Fields.Size} value={size} />

					{/* File Path */}
					<InfoField label={UIStrings.FileManager.FileInfoWindow.Fields.Path} value={localPath} />

					{/* File Type */}
					<InfoField label={UIStrings.FileManager.FileInfoWindow.Fields.Type} value={typeName} />

					<SectionHeader style={{marginTop: '4px'}} text={UIStrings.FileManager.FileInfoWindow.Headers.TimeInfo} />

					{/* Created: */}
					<InfoField label={UIStrings.FileManager.FileInfoWindow.Fields.Created} value={convertUTCTimeToLocalTime(created, timeFormatString)} />

					{/* Last Accessed: */}
					<InfoField label={UIStrings.FileManager.FileInfoWindow.Fields.Accessed} value={convertUTCTimeToLocalTime(accessed, timeFormatString)} />

					{/* Last Modified: */}
					<InfoField label={UIStrings.FileManager.FileInfoWindow.Fields.Modified} value={convertUTCTimeToLocalTime(modified, timeFormatString)} />
					
				</Cristal>
			</Fragment>
		)
	}
}


const InfoField = (props) => <Input fluid size={inputSize} label={<Label style={styles.labelWidth}>{props.label}</Label>} value={props.value} />
const SectionHeader = (props) => <Header style={(props.style) ? Object.assign(props.style,styles.header) : styles.header} as='h5'>{props.text}</Header>

