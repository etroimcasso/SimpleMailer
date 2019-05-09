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
				{	mailerHistory.length > 0 &&
					<div>
						{
							mailerHistory.map((item, index) => {
								return (
									<MailerHistoryItem item={item} key={index} />
								)
							})
						}
					</div>
				} 
				{ mailerHistory.length === 0 &&
					<span>{UIStrings.MailerHistory.NoHistory}</span> 
				}		
			</Segment>
		)
	}
}


class MailerHistoryItem extends Component {
	render() {
		const { item } = this.props
		return(
			<div id={item._id}>
				<div>{item.subject}:{item.mailerResults.length}</div>
				<div dangerouslySetInnerHTML={{__html: item.bodyHTML}} />
			</div>

		)
	}
}