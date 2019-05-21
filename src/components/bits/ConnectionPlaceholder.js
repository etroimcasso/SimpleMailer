import React, { Component, Fragment } from 'react';
import { observer, inject } from "mobx-react"
import { Segment, Header, Icon } from 'semantic-ui-react';
const UIStrings = require('../../config/UIStrings')


export default inject("connectionState")(observer(class ConnectionPlaceholder extends Component {
	render() {
		const { connection } = this.props.connectionState

		return(
			<Segment placeholder={!connection} basic>
			{	connection &&
				<Fragment>
					{ this.props.children }
				</Fragment>
			}

			{ !connection && 
				<Header icon>
					<Icon.Group size='big'>
						<Icon name='exclamation triangle' color='grey'/>
						{ false && <Icon name='dont' /> }
					</Icon.Group>
					<br />
					{UIStrings.NoConnection}
				</Header> 
			}
			</Segment>		
		)
	}
}))

