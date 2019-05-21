import React, { Component, Fragment } from 'react';
import { Segment, Header, Icon } from 'semantic-ui-react';


export default class ItemsPlaceholderSegment extends Component {
	render() {
		const { itemCount, noItemsText, iconName, itemsLoaded } = this.props

		return(
			<Segment placeholder={itemCount === 0} basic>
			{	itemCount > 0 &&
				<Fragment>
					{ this.props.children }
				</Fragment>
			}
			{ ( itemCount === 0 && itemsLoaded) &&
				<Header icon>
					<Icon.Group size='big'>
						<Icon name={iconName} color='grey'/>
						{ false && <Icon name='dont' /> }
					</Icon.Group>
					<br />
					{noItemsText}
				</Header> 
			}
			</Segment>		
		)
	}
}

