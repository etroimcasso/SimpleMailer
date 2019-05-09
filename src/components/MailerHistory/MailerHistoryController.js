import React, { Component, Fragment } from 'react';
import { Container, Segment, Dimmer, Loader } from 'semantic-ui-react';
import openSocket from 'socket.io-client';

const hostname = require('../../config/hostname.js');
const socket = openSocket(hostname.opensocket);


const UIStrings = require('../../config/UIStrings');
const ReconnectionTimer = require('../../helpers/ReconnectionTimer')

const getAllMailers = (callback) => {
	socket.on('getAllMailersResults', (error, mailerResults) => callback(error, mailerResults))
	socket.emit('getAllMailers')
}


export default class MailerHistoryController extends Component {
	state = {
		mailerHistory: [],
		mailerHistoryLoaded: false,
		reloadMailerHistoryPending: false
	}

	componentWillMount() {
		this.getAllMailers()
	}

	componentDidMount() {
		socket.on('connect', () => {
			if (this.state.reloadMailerHistoryPending) {
				this.setState({
					mailerHistory: [],
					mailerHistoryLoaded: false
				})
				this.getAllMailers()
			}
			this.setState({
				connection: true,
				reloadMailerHistoryPending: false
			})
		})

		socket.on('disconnect', () => {
			this.setState({
				connection: false,
				reloadMailerHistoryPending: true
			})
		})


		socket.on('mailerAddedToHistory', mailer => {
			console.log("ADDED TO HISTORY")
			this.setState({
				mailerHistory: this.state.mailerHistory.concat(JSON.parse(mailer))
			})
		})

	}

	getAllMailers = () => {
		ReconnectionTimer(3000,() => { 
			if (!this.state.mailerHistoryLoaded) 
				this.getAllMailers() 
		})

		getAllMailers((error, mailers) => {
			if (!error) {
				this.setState({
					mailerHistory: JSON.parse(mailers),
					mailerHistoryLoaded: true
				})
			}
		})
	}
	render() {
		const { mailerHistory, mailerHistoryLoaded } = this.state

		return(
			<Segment basic>
				<Dimmer inverted active={!mailerHistoryLoaded}>
					<Loader active={!mailerHistoryLoaded} inline>{UIStrings.MailerHistory.Loading}</Loader>
				</Dimmer>
				{ (mailerHistory.length > 0) ? mailerHistory.map((item, index) => <div key={index} id={item._id}>{item.subject}</div>) : <span>{UIStrings.MailerHistory.NoHistory}</span> }		
			</Segment>
		)
	}
}
