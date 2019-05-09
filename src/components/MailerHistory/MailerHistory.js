import React, { Component, Fragment } from 'react';
import { Container, Segment, Dimmer, Loader } from 'semantic-ui-react';
import openSocket from 'socket.io-client';

const hostname = require('../../config/hostname.js');
const socket = openSocket(hostname.opensocket);


const UIStrings = require('../../config/UIStrings');
const ReconnectionTimer = require('../../helpers/ReconnectionTimer')



export default class MailerHistory extends Component {
	
	render() {
		const { mailerHistory, mailerHistoryLoaded } = this.props

		return(
			<Segment basic>
				<Dimmer inverted active={!mailerHistoryLoaded}>
					<Loader active={!mailerHistoryLoaded} inline>{UIStrings.MailerHistory.Loading}</Loader>
				</Dimmer>
				{ (mailerHistory.length > 0) ? mailerHistory.map((item, index) => <div key={index} id={item._id}>{item.subject}:{item.mailerResults.length}</div>) : <span>{UIStrings.MailerHistory.NoHistory}</span> }		
			</Segment>
		)
	}
}
