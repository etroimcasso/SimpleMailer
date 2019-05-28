import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react'
import { Menu, Icon, Input, Popup, Divider, Modal, Button } from 'semantic-ui-react';
import FileSortMenu from './FileSortMenu'
import FileFilterMenu from './FileFilterMenu'
import FilePathBreadcrumb from './FilePathBreadcrumb'
const UIStrings = require('../../config/UIStrings')


const styles = {
	fullWidth: {
		width: '100%'
	}
}
export default inject('fileManagerState')(observer(class FileListToolbar extends Component {
	state = {
		newDirectoryModalOpen: false,
		newDirectoryName: ''
	}

	handleNewDirectoryAddClick = () => {
		this.props.fileManagerState.createNewDirectory(this.state.newDirectoryName)
		this.closeNewDirectoryModal()
	}
	handleNewDirectoryNameChange = value => this.setState({newDirectoryName: value})
	openNewDirectoryModal = () => this.setState({newDirectoryModalOpen: true})
	closeNewDirectoryModal = () =>  {
		this.setState({
			newDirectoryModalOpen: false,
			newDirectoryName: ''
		})

	}

	handleKeyPress = (key) => {
		if (key === 'Enter') this.handleNewDirectoryAddClick()
	}

	render() {
		const { newDirectoryName, newDirectoryModalOpen } = this.state
		const { fileManagerState: FileManagerState } = this.props
		const { pathArray, currentDirectory, directoriesFirst, allFilterTypes } = FileManagerState
		const inRootDirectory = pathArray.length === 0
		const sortType = FileManagerState.sortTypes[0]
		const noFilterTypes = allFilterTypes.length < 1
		const currentFiltersCount = FileManagerState.currentFilterTypes.length
		const popupPosition = "bottom center"

		return (
			<Fragment>
				<Modal
				size='mini'
				onClose={this.closeNewDirectoryModal}
				open={newDirectoryModalOpen}>
					<Modal.Header>{UIStrings.FileManager.NewDirectoryModal.Header}</Modal.Header>
					<Modal.Content>
						<Input fluid
						value={newDirectoryName} 
						onChange={(event) => this.handleNewDirectoryNameChange(event.target.value)} 
						onKeyPress={(event) => this.handleKeyPress(event.key)}
						autoFocus
						placeholder={UIStrings.FileManager.NewDirectoryModal.InputPlaceholder}
						/>

					</Modal.Content>						
					<Modal.Actions>
						<Button negative
							content={UIStrings.FileManager.NewDirectoryModal.CancelButtonText}
							onClick={this.closeNewDirectoryModal}
							/>
						<Button
							positive
							content={UIStrings.FileManager.NewDirectoryModal.OKButtonText}
							onClick={this.handleNewDirectoryAddClick}
							disabled={newDirectoryName.length === 0}
							/>
					</Modal.Actions>
				</Modal>
				<Menu fluid icon size='huge' compact>
					<Menu.Item 
					disabled={inRootDirectory} 
					onClick={FileManagerState.openParentDirectory}>
						<Icon name='chevron left' /> 
					</Menu.Item>
					
					<Menu.Item
					disabled={inRootDirectory}
					onClick={FileManagerState.resetDirectory}>
						<Icon name='home' />
					</Menu.Item>
					<Menu.Item style={styles.fullWidth}>
						<FilePathBreadcrumb />
					</Menu.Item>
				</Menu>
				<br />
				<Menu fluid icon  size='mini' compact>

					<Menu.Menu position='left'>
						<Menu.Item onClick={this.openNewDirectoryModal}>
							<Icon name='plus' />
						</Menu.Item>

						<Menu.Item disabled>
							<Icon name='upload' />
						</Menu.Item>
					</Menu.Menu>

					<Menu.Menu position='right'>
						<Popup
						on='click'
						hoverable
						hideOnScroll
						position={popupPosition}
						trigger={(
							<Menu.Item>
								<Icon name='sort' />
							</Menu.Item> 
							)}>
							<FileSortMenu />
						</Popup>
		
						<Popup
						on='click'
						hoverable
						hideOnScroll
						disabled={noFilterTypes}
						position={popupPosition}
						wide
						trigger={(
							<Menu.Item active={currentFiltersCount !== allFilterTypes.length} disabled={noFilterTypes}>
								<Icon name='filter' />
							</Menu.Item> 
							)}>
							<FileFilterMenu />
						</Popup>
					</Menu.Menu>


				</Menu>
			</Fragment>
		)
	}
}))
