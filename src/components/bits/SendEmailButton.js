import React, { Component } from 'react';
import { Button, Icon } from 'semantic-ui-react';


export default class SendEmailButton extends Component {
	render() {
		const { disabled, attached } = this.props
		return(
			<Button icon attached={attached} labelPosition='right' onClick={this.props.onClick} disabled={disabled}>
				<Icon name="send" />
				Send
			</Button>
		)


	}
}