import React, { Component } from 'react';
import { Input } from 'semantic-ui-react';

export default class SubjectInput extends Component {
	render() {
		const { value, onChange, style, fluid } = this.props
		return (
			<Input fluid={fluid} label="Subject" name="subject" value={value} style={style} onChange={(event) => onChange(event.target.name, event.target.value)} />
		)
	}
}

