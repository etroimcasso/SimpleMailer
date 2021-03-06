import React, { Component } from 'react';
import { Accordion, Icon, Label } from 'semantic-ui-react';
import SubscribersList from './bits/SubscribersList'

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
		const { subscribers, loaded} = this.props
		const dropdownIcon = (<Icon name="dropdown"/>)
		return (
			<Accordion fluid style={styles.leftAlignedText}>
				<Accordion.Title index={0} active={active} onClick={this.toggleAccordion}>
						{dropdownIcon}
						{UIStrings.SubscribersNoun} 
						{ loaded &&
							<Label size="large" circular>{subscribers.length}</Label>
						}
				</Accordion.Title>
				<Accordion.Content active={active} style={Object.assign(styles.height, styles.autoYOverflow)}>
					<SubscribersList subscribers={subscribers} style={{height: '21vh'}} />
				</Accordion.Content>
			</Accordion>
		)
	}

}
