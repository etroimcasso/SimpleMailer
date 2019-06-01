import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react'
import { Breadcrumb } from 'semantic-ui-react';
const UIStrings = require('../../config/UIStrings')
const ConstructPathFromArray = require('../../helpers/ConstructPathFromArray')

const styles = {
	container: {
		display: 'flex !important',
		alignContent: 'center',
		justifyContent: 'center',
		width: '50vw',
	}
}

const dividerIcon = 'angle right'

export default inject('fileManagerState')(observer(class FilePathBreadcrumb extends Component {

	goToHome = () => this.props.fileManagerState.setDirectory('/')


	breadcrumbSection = (item, index) => {
		const fileManagerState = this.props.fileManagerState
		const pathArray = fileManagerState.pathArray
		const slicedPath = pathArray.slice(0, index + 1)
		const active = fileManagerState.currentDirectory === ConstructPathFromArray(slicedPath) 
		
		return (
			<Fragment key={pathArray[index]}>
				<Breadcrumb.Section 
				active={active}
				onClick={(active) 
					? null 
					: () => fileManagerState.setDirectory(ConstructPathFromArray(slicedPath))}

				>
					{pathArray[index]}
				</Breadcrumb.Section>
				<Breadcrumb.Divider icon={dividerIcon} />
			</Fragment>
		)
	}

	render() {
		const { fileManagerState: FileManagerState } = this.props
		const { pathArray, currentDirectory } = FileManagerState

		return (
				<Breadcrumb style={styles.container}>
					<Breadcrumb.Section active={currentDirectory === '/'}
					onClick={(currentDirectory === '/') ? null : this.goToHome}>
						{UIStrings.FileManager.RootDirectoryBreadcrumbName}
					</Breadcrumb.Section>
					<Breadcrumb.Divider icon={dividerIcon} />
					{pathArray.map((item, index) => this.breadcrumbSection(item, index))}
				</Breadcrumb>
		)
	}

}))


