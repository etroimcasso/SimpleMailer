import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Modal, Button, Segment, Progress  } from 'semantic-ui-react';

export default inject("fileManagerState","connectionState")(observer(class UploadFileModal extends Component {


	render() {
		const { fileManagerState: FileManagerState, connectionState: ConnectionState, open } = this.props
		return (
			<Modal open={open} onClose={FileManagerState.closeUploadFileModal} closeOnDimmerClick={false}>
				<Modal.Header>Upload Files</Modal.Header>
				<Modal.Content>
					<Segment>
					</Segment>
					<Modal.Actions>
						<Button negative onClick={FileManagerState.closeUploadFileModal}>
							Cancel
						</Button>
						<Button positive>
							Upload
						</Button>
					</Modal.Actions>
				</Modal.Content>
			</Modal>
		)


	}
}))