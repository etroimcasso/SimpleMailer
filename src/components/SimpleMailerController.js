import React, { Component } from 'react';

import EditorController from './editor/EditorController';

export default class SimpleMailController extends Component {
	state = {

	}

	render() {
		const {} = this.state
		return(
			<div>
				This component will handle communications with the server between the Editor and the rest
				<EditorController />
			</div>
		)
	}
}