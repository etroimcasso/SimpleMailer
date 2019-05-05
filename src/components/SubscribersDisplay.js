import React, { Component } from 'react';
import { Accordion, List, Icon, Label } from 'semantic-ui-react';


const styles = {
	leftAlignedText: {
		textAlign: 'left'
	},
	height: {
		height: '150px',
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
		const dropdownIcon = (<Icon name="dropdown" />)
		return (
			<Accordion fluid style={styles.leftAlignedText}>
				<Accordion.Title index={0} active={active} onClick={this.toggleAccordion}>
					{dropdownIcon} Subscribers 
					{ loaded &&
					<Label circular>{subscribers.length}</Label>
					}
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
			<List relaxed divided style={Object.assign(styles.leftAlignedText, styles.fullWidth)} size="small">
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