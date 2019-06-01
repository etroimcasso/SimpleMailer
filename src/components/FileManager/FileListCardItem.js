import React, { Component, Fragment } from 'react'
import { observer, inject } from "mobx-react"
import { Card, Icon, Image } from 'semantic-ui-react'
import FileItemContextMenuPopup from './FileItemContextMenuPopup'
import FileContextMenu from './FileContextMenu'
import SimpleInputModal from '../bits/SimpleInputModal'
import FileInfoWindow from './FileInfoWindow'
import Cristal from 'react-cristal'
const UIStrings = require('../../config/UIStrings')
const ConstructPathFromArray = require('../../helpers/ConstructPathFromArray')

const maxCharactersToDisplayInFileName = 32
const styles = {
	centeredContentFlexDiv: {
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
		renameModalOpen: false,
		infoWindowOpen: false
	}

	openRenameModal = () => {
		this.closePopup()
		this.setState({ renameModalOpen: true })
	}
	closeRenameModal = () => {
		this.setState({ renameModalOpen: false })
	}

	renameItem = (newName) => {
		const file = this.props.file
		this.props.fileManagerState.renameItem(file.path, file.name, newName)
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

	openInfoWindow = () => { 
		this.setState({infoWindowOpen: true})
		this.closePopup()
	}

	closeInfoWindow = () => this.setState({infoWindowOpen: false})

	render() {
		const { fileManagerState: FileManagerState, file } = this.props
		const { hover, selected, renameModalOpen, infoWindowOpen } = this.state
		const isDirectory = file.isDir
		const fileNameTooLong = file.name.length > maxCharactersToDisplayInFileName
		const fileName = (fileNameTooLong) ? `${file.name.slice(0,maxCharactersToDisplayInFileName)}...` : file.name
		const renameModalTitle = UIStrings.FileManager.RenameFileModal.Header(file.name)


		return(
			<Fragment>
				{/* Rename Modal */}
				<SimpleInputModal
				size='mini'
				open={renameModalOpen}
				onClose={this.closeRenameModal}
				headerText={renameModalTitle}
				inputPlaceholder={UIStrings.FileManager.RenameFileModal.InputPlaceholder}
				style={styles.topLayer}
				submitButtonText={UIStrings.FileManager.RenameFileModal.OKButtonText}
				submitButtonFunction={this.renameItem}
				cancelButtonText={UIStrings.FileManager.RenameFileModal.CancelButtonText}
				minLength={1}
				maxLength={100}
				/>

				{/* Information Window */}
				{ infoWindowOpen &&
					<FileInfoWindow onClose={this.closeInfoWindow} file={file} path={ConstructPathFromArray(FileManagerState.pathArray)} />
				}

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
						onRenameClick={this.openRenameModal}
						onInfoClick={this.openInfoWindow}
						/>
					</FileItemContextMenuPopup>
				</div>
			</Fragment>
		)
	}
}))

