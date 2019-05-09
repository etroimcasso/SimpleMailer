import React, { Component, Fragment } from 'react';
import openSocket from 'socket.io-client';

const hostname = require('../../config/hostname.js');
const socket = openSocket(hostname.opensocket);

const UIStrings = require('../../config/UIStrings');


export default class MailerHistoryController extends Component {

	render() {
		const { connection } = this.props

		return(
			<Fragment>
			
			</Fragment>
		)
	}
}
