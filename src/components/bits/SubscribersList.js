import React, { Component } from 'react';
import { List, Icon, Transition } from 'semantic-ui-react';

const UIStrings = require('../../config/UIStrings')

const styles = {
	leftAlignedText: {
		textAlign: 'left'
	},
	height: {
		height: '21vh',
	},
	autoYOverflow: {
		overflowY:'auto'
	},
	fullWidth: {
		width:'100%'
	},
	redText: {
		color: `#FF0000`
	}

}

export default class SubscribersList extends Component {
	render() {
		const { subscribers, style } = this.props
		return(
			<Transition.Group as={List} animation='scale' duration={200} relaxed divided style={Object.assign(style,Object.assign(styles.leftAlignedText, styles.fullWidth, styles.autoYOverflow))} size="small">
				{(subscribers.length > 0) ? subscribers.map((subscriber, index) => <SubscribersListItem key={index} subscriber={subscriber} />) 
				: <span>{UIStrings.NoSubscribers}</span> }
			</Transition.Group>
		)
	}
}


class SubscribersListItem extends Component {
	render() {
		const { subscriber } = this.props
		const subsIcon = (<Icon name="mail" />)
		const errorIcon = (<Icon name="cancel" color="red"/>)
		const error = subscriber.error


		return(
			<List.Item verticalAlign="center" floated="left" style={styles.fullWidth}>
				{(error) ? errorIcon : subsIcon}
				<List.Content>
					<span style={(error) ? styles.redText : null}>{subscriber.email}</span>
				</List.Content>
			</List.Item>
		)
	}
}