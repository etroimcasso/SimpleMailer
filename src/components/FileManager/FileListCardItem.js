import React, { Component, Fragment } from 'react'
import { observer, inject } from "mobx-react"
import { Card, Icon, Image, Popup, Menu, Header, Divider } from 'semantic-ui-react'
import FileItemContextMenuPopup from './FileItemContextMenuPopup'
import FileContextMenu from './FileContextMenu'
import SimpleInputModal from '../bits/SimpleInputModal'
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
		renameModalOpen: false
	}

	openRenameModal = () => {
		this.closePopup()
		this.setState({ renameModalOpen: true })
	}
	closeRenameModal = () => {
		this.setState({ renameModalOpen: false })
	}

	renameItem = (filepath, oldName, newName) => {
		this.props.fileManagerState.renameItem(filepath, oldName, newName)
	}


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
		this.props.fileManagerState.resetContextMenu()
		 this.props.file.isDir ? this.handleDirectoryClick() : this.handleFileClick()
	}

	handleRightClick = (event) => {
		const fileManagerState = this.props.fileManagerState
		const contextMenuName = fileManagerState.contextMenuName
		const filename = this.props.file.name
		//console.log(`Old context: ${contextMenuName}` )
		//console.log(`new context name: ${filename}`)
		event.preventDefault()
		contextMenuName.length > 0
			? ((contextMenuName !== filename) 
				? fileManagerState.setContextMenu(filename) 
				: fileManagerState.resetContextMenu())
			: fileManagerState.setContextMenu(filename)
	}

	closePopup = () => this.props.fileManagerState.resetContextMenu()
	disableHover = () => this.setState({hover: false})
	enableHover = () => this.setState({hover: true})

	render() {
		const { fileManagerState: FileManagerState, file } = this.props
		const { hover, selected, renameModalOpen } = this.state
		const isDirectory = file.isDir
		const fileNameTooLong = file.name.length > maxCharactersToDisplayInFileName
		const fileName = (fileNameTooLong) ? `${file.name.slice(0,maxCharactersToDisplayInFileName)}...` : file.name


		return(
			<Fragment>
				<SimpleInputModal
				size='fullscreen'
				open={renameModalOpen}
				onClose={this.closeRenameModal}
				headerText={UIStrings.FileManager.RenameFileModal.Header}
				style={styles.topLayer}
				submitButtonFunction={this.renameItem}

				/>
				<div style={styles.cardSize}>
					<FileItemContextMenuPopup
					disabled={file.name !== FileManagerState.contextMenuName}
					open={file.name === FileManagerState.contextMenuName}
					onClose={this.closePopup}
					filename={file.name}
					trigger={(
						<Card onMouseEnter={this.enableHover} 
						onMouseLeave={this.disableHover} 
						onContextMenu={(event) => this.handleRightClick(event)} 
						onClick={(event) => this.handleClick(event)} 
						style={(hover) ? styles.cardSize : Object.assign(styles.noBorder, styles.cardSize)}>
							<Card.Content>
								<div style={styles.centeredContentFlexDiv} >
									<Icon size='huge' name={file.icon} color={file.color || 'grey'} />
								</div>
								<Card.Header style={{width: '100%', wordWrap: 'break-word'}}>{fileName}</Card.Header>
								{ !isDirectory &&
									<Card.Meta>{file.size}</Card.Meta>
								}
							</Card.Content>
						</Card>
					)}>
						<FileContextMenu 
						fileName={file.name} 
						filePath={file.path} 
						onRenameClick={this.openRenameModal}
						/>
					</FileItemContextMenuPopup>
				</div>
			</Fragment>
		)
	}
}))

