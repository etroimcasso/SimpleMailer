import React, { Component } from 'react';
import openSocket from 'socket.io-client';
import SimpleMailerController from './SimpleMailerController';
import TopBar from './TopBar';

const hostname = require('../config/hostname.js');
const socket = openSocket(hostname.opensocket);

export default class SimpleMailer extends Component {
	state = {
		connection: false
	}

	componentDidMount = () => {
		socket.on('connect', () => {
			this.setState({
				connection: true
			})
		})

		socket.on('disconnect', () => {
			this.setState({
				connection: false
			})
		})
	}

	render() {
		const { connection } = this.state
		return(
			<div>
				<TopBar connection={connection} />
      			<SimpleMailerController connection={connection}/>
      		</div>
		)

	}
}