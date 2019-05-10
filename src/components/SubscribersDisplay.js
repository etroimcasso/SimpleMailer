import React, { Component } from 'react';
import { Accordion, List, Icon, Label, Transition } from 'semantic-ui-react';

const UIStrings = require('../config/UIStrings')

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

export default class SubscribersDisplay extends Component {
	state = {
		active: false
	}

	toggleAccordion = () => {
		this.setState({
			active: !this.state.active
		})
	}

	render() {
		const { active } = this.state
		const { subscribers, loaded } = this.props
		const dropdownIcon = (<Icon name="dropdown"/>)
		return (
			<Accordion fluid style={styles.leftAlignedText}>
				<Accordion.Title index={0} active={active} onClick={this.toggleAccordion}>
					<Label size="large">
						{dropdownIcon}
						{UIStrings.SubscribersNoun} 
						{ loaded &&
							<Label.Detail style={{paddingTop: '2px'}}>{subscribers.length}</Label.Detail>
						}
					</Label>
				</Accordion.Title>
				<Accordion.Content active={active} style={Object.assign(styles.height, styles.autoYOverflow)}>
					<SubscribersList subscribers={subscribers} />
				</Accordion.Content>
			</Accordion>
		)
	}

}

class SubscribersList extends Component {
	render() {
		const { subscribers } = this.props
		return(
			<Transition.Group as={List} animation='scale' duration={200} relaxed divided style={Object.assign(styles.leftAlignedText, styles.fullWidth)} size="small">
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