import React, { Component } from 'react';
import openSocket from 'socket.io-client';
const hostname = require('../config/hostname.js');
const socket = openSocket(hostname.opensocket);

export default class ConnectionWrapper extends Component {
	state = {
		connection: false
	}

	componentDidMount() {
		socket.on('connect', () => {
			this.setState({
				connection: true,
			})
		})

		socket.on('disconnect', () => {
			this.setState({
				connection: false,
			})
		})
	}

	render() {
		const { connection } = this.state
		return(
			<div>
				{React.cloneElement(this.props.children, { connection: connection })}
			</div>
		)
	}
}