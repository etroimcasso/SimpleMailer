import React, { Component } from 'react';
import { Accordion, List, Icon, Label } from 'semantic-ui-react';


const styles = {
	leftAlignedText: {
		textAlign: 'left'
	},
	maxHeight: {
		maxHeight: '100px'
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
		const { subscribers } = this.props
		const dropdownIcon = (<Icon name="dropdown" />)
		return (
			<Accordion fluid style={styles.leftAlignedText}>
				<Accordion.Title index={0} active={active} onClick={this.toggleAccordion}>
					{dropdownIcon} Subscribers
				</Accordion.Title>
				<Accordion.Content active={active}>
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
			<List relaxed style={Object.assign(styles.maxHeight, styles.leftAlignedText, styles.autoYOverflow, styles.fullWidth)}>
				{(subscribers.length > 0) ? subscribers.map((subscriber, index) => <SubscribersListItem key={index} subscriber={subscriber} />) 
				: <span>There are no subscribers</span> }
			</List>
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