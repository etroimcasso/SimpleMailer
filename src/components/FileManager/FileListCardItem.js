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
	},
	noBorder: {
		boxShadow: 'none'
	}
}

export default inject("fileSystemState")(observer(class FileListCardItem extends Component {

	state = {
		hover: false
	}

	handleDirectoryClick = () => this.props.fileSystemState.openDirectory(this.props.file.name)
	handleFileClick = () => (console.log("THIS NEEDS SOMETHING TO DO!"))
	toggleHover = () => {
		this.setState({
			hover: !this.state.hover
		})
	}

	render() {
		const { fileSystemState: FileSystemState, file } = this.props
		const { hover } = this.state
		const isDirectory = file.isDir


		return(
			<Card onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover} onClick={(isDirectory) ? this.handleDirectoryClick : this.handleFileClick} style={(hover) ? null : styles.noBorder}>
				<Card.Content>
					<div style={styles.centeredContentFlexDiv}>
						<Icon size="huge" name={file.icon} color={file.color || 'grey'} />
					</div>
					<Card.Header>{file.name}</Card.Header>
					{ !isDirectory &&
						<Card.Meta>{file.size}</Card.Meta>
					}
				</Card.Content>
			</Card>
		)
	}
}))
