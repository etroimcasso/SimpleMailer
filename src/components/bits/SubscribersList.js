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
	}
}

export default class SubscribersList extends Component {
	render() {
		const { subscribers } = this.props
		return(
			<Transition.Group as={List} animation='scale' duration={200} relaxed divided style={Object.assign(styles.leftAlignedText, styles.fullWidth, styles.height)} size="small">
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

		return(
			<List.Item verticalAlign="center" floated="left" style={styles.fullWidth}>
				<List.Content>
					{subsIcon}{subscriber.email}
				</List.Content>
			</List.Item>
		)
	}
}