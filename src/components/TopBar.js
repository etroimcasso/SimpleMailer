//Shows connection status in the top left corner
import React, { Component } from 'react';
import { Menu, Icon, Popup } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import openSocket from 'socket.io-client';

const hostname = require('../config/hostname.js');
const socket = openSocket(hostname.opensocket);
const UIStrings = require('../config/UIStrings')

const styles = {
	appTitleText: {
		position: 'relative',
		paddingTop: '5px',
		left: '-20px'
	},
	connectionHeaderText: {
		paddingTop: '5px'
	},
	redText: {
		color: "#ff0000"
	},
}


export default class TopBar extends Component {
	state = {
		//connection: false
	}

	componentDidMount() {
		/*
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
		*/
	}

	render() {
		const { connection } = this.props

		//const connectionStatusIconName = (connection) ? "circle" : "circle"
		const connectionStatusIconColor = (connection) ? "green" : "red"

		return (
			<Menu inverted icon borderless fixed="top" size="large">
				<Menu.Item header>
					<Popup hideOnScroll 
						trigger={(<Icon circular name="circle" color={connectionStatusIconColor} size="small" />)}
						on="hover"
						>
					<span style={(connection) ? null : styles.redText }>{(connection) ? UIStrings.TopBar.ConnectionStatusConnected : UIStrings.TopBar.ConnectionStatusDisconnected}</span>
					</Popup>
					<span style={styles.connectionHeaderText}>{UIStrings.TopBar.ConnectionText}</span>
				</Menu.Item>
				<Menu.Item>
					<span style={styles.appTitleText}>{UIStrings.TopBar.MenuHeaderText}</span>
				</Menu.Item>
				<Menu.Item name="mailer" as={NavLink} to="/" exact>
					{UIStrings.TopBar.NewMailerText}
				</Menu.Item>
				<Menu.Item name="history" as={NavLink} to="/history" exact>
					{UIStrings.TopBar.MailingHistoryText}
				</Menu.Item>
			</Menu>
		)
	}
}
