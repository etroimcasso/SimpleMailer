import React, { Component, Fragment, createRef } from 'react'
import { observer, inject } from "mobx-react"
import { Card, Icon, Image, Popup } from 'semantic-ui-react'
const UIStrings = require('../../config/UIStrings')

const maxCharactersToDisplayInFileName = 32
const styles = {
	centeredContentFlexDiv: {
		display: '-webkit-box',
	    display: '-moz-box',
	    display: '-ms-flexbox',
	    display: '-webkit-flex',
	    display: 'flex',
	    alignItems: 'center',
	    justifyContent: 'center',
	    paddingBottom: '10px',
	},
	topPaddedCardHeader: {
		//paddingTop: '10px'
	},
	noBorder: {
		boxShadow: 'none',
	},
	cardSize: {
		height: '100%',
		width: '100%'
	}
}

export default inject("fileManagerState")(observer(class FileListCardItem extends Component {

	state = {
		hover: false,
		selected: false,
	}

	 contextRef = createRef()

	//TODO: Check selected
	//if selected, trigger click action
	//If not selected, trigger select action

	handleDirectoryClick = () => this.props.fileManagerState.openDirectory(this.props.file.name)
	handleFileClick = () => (console.log("THIS NEEDS SOMETHING TO DO!"))
	toggleHover = () => {
		this.setState({
			hover: !this.state.hover
		})
	}

	handleClick = (event) => {
		if (this.props.fileManagerState.contextMenuName.length === 0) this.props.file.isDir ? this.handleDirectoryClick() : this.handleFileClick()
	}

	handleRightClick = (event) => {
		event.preventDefault()
		this.props.fileManagerState.setContextMenu(this.props.file.name)
	}

	closePopup = () => this.props.fileManagerState.resetContextMenu()


	render() {
		const { fileManagerState: FileManagerState, file } = this.props
		const { hover, selected } = this.state
		const isDirectory = file.isDir
		const fileNameTooLong = file.name.length > maxCharactersToDisplayInFileName
		const fileName = (fileNameTooLong) ? `${file.name.slice(0,maxCharactersToDisplayInFileName)}...` : file.name


		return(
			<Fragment>
				<Popup open={file.name === FileManagerState.contextMenuName} position='top center'
					onClose={this.closePopup}
					context={this.contextRef}>
					THIS IS A TEST FOR {file.name}
				</Popup>
				<div style={styles.cardSize} ref={this.contextRef}>
					<Card onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover} onContextMenu={(event) => this.handleRightClick(event)} onClick={(event) => this.handleClick(event)} style={(hover) ? styles.cardSize : Object.assign(styles.noBorder, styles.cardSize)}>
	
						<Card.Content>
							<div style={styles.centeredContentFlexDiv}>
								<Icon size="huge" name={file.icon} color={file.color || 'grey'} />
							</div>
							<Card.Header style={{width: '100%', wordWrap: 'break-word'}}>{fileName}</Card.Header>
							{ !isDirectory &&
								<Card.Meta>{file.size}</Card.Meta>
							}
						</Card.Content>
					</Card>
				</div>
			</Fragment>
		)
	}
}))
