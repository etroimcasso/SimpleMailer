import React, { Component, Fragment } from 'react'
import { observer, inject } from "mobx-react"
import { Card, Icon, Image} from 'semantic-ui-react'
const UIStrings = require('../../config/UIStrings')

const styles = {
	centeredContentFlexDiv: {
		display: '-webkit-box',
	    display: '-moz-box',
	    display: '-ms-flexbox',
	    display: '-webkit-flex',
	    display: 'flex',
	    alignItems: 'center',
	    justifyContent: 'center',
	    paddingBottom: '10px'
	},
	topPaddedCardHeader: {
		//paddingTop: '10px'
	}
}

export default inject("fileSystemState")(observer(class FileListCardItem extends Component {


	handleDirectoryClick = () => this.props.fileSystemState.openDirectory(this.props.file.name)
	handleFileClick = () => (console.log("THIS NEEDS SOMETHING TO DO!"))



	render() {
		const { fileSystemState: FileSystemState, file } = this.props
		const isDirectory = file.isDir


		return(
			<Card onClick={(isDirectory) ? this.handleDirectoryClick : this.handleFileClick}>
				<Card.Content>
					<div style={styles.centeredContentFlexDiv}>
						<Icon size="huge" name={file.icon} color={file.color || 'grey'} />
					</div>
					<Card.Header>{file.name}</Card.Header>
				<Card.Meta>Size: {file.size}</Card.Meta>
				</Card.Content>
			</Card>
		)
	}
}))

const FolderIcon = ( props = {} ) => <Icon {...props} name="folder outline" />
const FileIcon = ( props = {} ) => <Icon {...props} name="file alternate outline" />
