import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react'
import { Breadcrumb } from 'semantic-ui-react';
const UIStrings = require('../../config/UIStrings')

const constructPathFromArray = (pathArray) => pathArray.reduce((acc, cv) =>  `${acc}${cv}/`, '/')

export default inject('fileManagerState')(observer(class FilePathBreadcrumb extends Component {

	goToHome = () => this.props.fileManagerState.setDirectory('/')


	breadcrumbSection = (item, index) => {
		const fileManagerState = this.props.fileManagerState
		const pathArray = fileManagerState.pathArray
		const currentDirectory = fileManagerState.currentDirectory.split('/')
		const slicedPath = pathArray.slice(0, index + 1)
		const active = fileManagerState.currentDirectory === constructPathFromArray(slicedPath) 
		return (
			<Fragment key={pathArray[index]}>
				<Breadcrumb.Section 
				active={active}
				onClick={(active) 
					? null 
					: () => fileManagerState.setDirectory(constructPathFromArray(slicedPath))}

				>
					{pathArray[index]}
				</Breadcrumb.Section>
				<Breadcrumb.Divider icon='angle right' />
			</Fragment>
		)
	}

	render() {
		const { fileManagerState: FileManagerState } = this.props
		const { pathArray, currentDirectory } = FileManagerState

		return (
			<Breadcrumb>
				<Breadcrumb.Section active={currentDirectory === '/'}
				onClick={(currentDirectory === '/') ? null : this.goToHome}>
					Home
				</Breadcrumb.Section>
				<Breadcrumb.Divider icon='angle right' />
				{pathArray.map((item, index) => this.breadcrumbSection(item, index))}
			</Breadcrumb>

		)
	}

}))


