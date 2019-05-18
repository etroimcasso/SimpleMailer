import React, { Component } from 'react';
import { Menu, Icon, Popup, Label } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { observer, inject } from "mobx-react"
const UIStrings = require('../config/UIStrings')

const styles = {
	appTitleText: {
		position: 'relative',
		//paddingTop: '4px',
		//left: '-20px'
	},
	connectionHeaderText: {
		paddingTop: '3px'
	},
	redText: {
		color: "#ff0000"
	},
	loadingIconPadding: {
		paddingLeft: '5px',
		paddingTop: '3px'
	}
}


export default inject("mailerContentState", "connectionState", "subscriberState", "mailerHistoryState")(observer(class TopBar extends Component {

	render() {
		const { mailerContentState: MailerContentState, connectionState: ConnectionState, subscriberState: SubscribersState, mailerHistoryState: MailerHistoryState } = this.props
		const { connection } = ConnectionState
		const { subscribersLoaded } = SubscribersState
		const { mailerHistory, mailerHistoryLoaded } = MailerHistoryState
		
		const { mailerContentFilesLoaded } = MailerContentState

		//const connectionStatusIconName = (connection) ? "circle" : "circle"
		const connectionStatusIconColor = (connection) ? "green" : "red"


		return (
			<Menu compact inverted icon borderless fixed="top" size="large">
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
					<span style={styles.appTitleText}>{UIStrings.AppTitle}</span>
				</Menu.Item>
				<Menu.Item name="mailer" as={NavLink} to="/" exact>
					{UIStrings.TopBar.NewMailerText}
				</Menu.Item>
				<Menu.Item name="history" as={NavLink} to="/history" exact>
					{UIStrings.TopBar.MailingHistoryText}
					{ mailerHistoryLoaded &&
						<Label circular>
							{MailerHistoryState.mailerHistoryCount}
						</Label>
					}
					{!mailerHistoryLoaded && 
						<div style={styles.loadingIconPadding}>
							<Icon name="spinner" loading />
						</div>
					}
				</Menu.Item>
				<Menu.Item name="subscribers" as={NavLink} to="/subscriptions">
					{UIStrings.TopBar.SubscribersText}
					{ subscribersLoaded &&
						<Label circular>
							{SubscribersState.subscriberCount}
						</Label>
					}
					{ !subscribersLoaded && 
						<div style={styles.loadingIconPadding}>
							<Icon name="spinner" loading />
						</div>
					}
				</Menu.Item>
				<Menu.Item name="files" as={NavLink} to="/files">
					{UIStrings.TopBar.FileManagerText}
					{ mailerContentFilesLoaded &&
						<Label circular>
							{MailerContentState.filesCount}
						</Label>
					}
					{ !mailerContentFilesLoaded && 
						<div style={styles.loadingIconPadding}>
							<Icon name="spinner" loading />
						</div>
					}
				</Menu.Item>
			</Menu>
		)
	}
}))
