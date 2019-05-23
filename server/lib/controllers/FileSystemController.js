const fs = require('fs');
const path = require('path');
const contentDirectory = path.join(__dirname,'../../../mailerContent/')
const util = require('util');
const FileTypeGroups = require('../../config/FileTypeGroups')
const ServerStrings = require('../../config/ServerStrings')


const getFileStatObject = async function (filePath) { 
	let fsStat
	try {
		fsStat = await util.promisify(fs.stat)(filePath)
	} catch (e) {
		console.error(`Can't get file stats for ${filePath}: ${e}`)
	}
	return fsStat
}

const addFilePath = (path, file) => `${path}${file}`

const getFileExtension = (filename) => {
	const splitName = filename.split('.')
	const splitLength = splitName.length
	return (splitLength === 1) ? "" : `.${splitName[splitLength - 1]}`
}

//Collect all but the last item in the array
const getFileName =  (filename) => {
	return filename.split('.').reduce((accumulator, currentValue, index, array) => (index >= array.length - 2) ? accumulator : accumulator.concat(currentValue))
}

const formatFileSize = (fileSizeObject) =>{ 
	const splitSize = fileSizeObject.size.toString().split('.')
	const digits = splitSize[0]
	const decimalDigits = (splitSize.length > 1) ? splitSize[1].slice(0,2) : ''
	return `${digits}${ (decimalDigits.length != 0) ? `.${decimalDigits}` : ''} ${fileSizeObject.unit}`
}

	/* Take a filesize in bytes
		1024 bytes = 1 KB
		1024 KB = 1MB
		1024MB = 1GB
		1024GB = 1TB
	
		Divide by 1024
		Return this number unless its results have 4 or more digits before the decimal

		Index will track the unit:
		0: B , for when the initial value is > 4 digits - bytes has no decimal
		1: KB
		2: MB <--Should probably never proceed past this on the internet for years to come when it's just mailing list content 
		3: GB
		4: TB
	*/
const convertFileSizeToHumanReadable = (filesize) => {
	const fileSizeSuffixes = ["B","KB","MB","GB","TB","PB","EB"]
	const reduceFunc = (acc, cv, index) => (acc.size.toString().split('.')[0].length <= 3) ? acc : acc = { size: acc.size / 1024, unit: fileSizeSuffixes[index + 1]}
	return fileSizeSuffixes.reduce(reduceFunc, { size: filesize, unit: fileSizeSuffixes[0] })
}




const createGroupedFileTypeArray = fileList => {
	const isDirectory = (file) => file.isDir
	const isDotFile = (file) => {
		//Dot files have a name that starts with a dot OR an extension only	
		if (noName(file)) { // No File name
			if (noExtension(file)) return false// No File Extension
			else return true//Just file extension = dot file
		} else { // File name
			if (noExtension(file)) return false //File name, no extension
			else return Array.from(file.name)[0] === '.'
		}
	}
	const noName = (file) => getFileName(file.name).length === 0 || getFileName(file.name) === ''
	const noExtension = (file) => getFileExtension(file.name).length === 0 || getFileExtension(file.name) === ''
	const extensionsMatch = (file, extension) => getFileExtension(file.name).toLowerCase() === extension
	const splitName = (file) => file.name.split('.')
	const dotFileHasNoExtension = (file) => splitName(file)[0] === '' && splitName(file).length === 2 
	const fileTypeGroupingFilter = (currentFile, fileExtension, sortGroup) => {
		if (isDirectory(currentFile) ) {
			if (sortGroup.type === 'directory') return true
			else return false 
		} else if (noExtension(currentFile)) {
			if (sortGroup.type === 'none') return true
			else return false
		}
		else { //Directories are excluded, file has extension
			if (isDotFile(currentFile)) {
				if (dotFileHasNoExtension(currentFile)) //Dot file has no extension
					if(sortGroup.type === 'none') return true 
					else return false
			} //File has extension, did not match the previous cases
			if (extensionsMatch(currentFile, fileExtension)) return true
			else return false
		}

	}

	const groupedFilesWithoutOthers = FileTypeGroups.map(sortGroup => {
		return { 
			name: sortGroup.name,
			type: sortGroup.type, 
			icon: sortGroup.icon,
			color: sortGroup.color,
			files: sortGroup.extensions.map(fileExtension => 
				fileList.filter(currentFile => fileTypeGroupingFilter(currentFile, fileExtension, sortGroup))).reduce((acc, cv)=> acc.concat(cv))
		}
	})

	const flatItemAddition = (type, name, icon, color) => { return { type: type, typeName: name, icon: icon, color: color }}
	const flattenListFunc = (flattenedList, sortGroup) => 
		flattenedList.concat(sortGroup.files.map(currentFile => 
			Object.assign(currentFile, flatItemAddition(sortGroup.type, sortGroup.name, sortGroup.icon, sortGroup.color))))

	const flattenedSortGroup = groupedFilesWithoutOthers.reduce(flattenListFunc, [])

	//combine flattenedSortGroup with fileList
	//filter out all that have a non-null type property
	const combinedList = flattenedSortGroup.concat(fileList)
	const otherFiles = { 
		name: ServerStrings.FileSorting.GroupNames.Other,
		type: 'other',
		color: ServerStrings.FileSorting.GroupColors.Other,
		files: combinedList.filter(item => !item.type).map(file => file)
	}

	
	const flattenedOthers = otherFiles.files.map((currentFile) => {
		return Object.assign(currentFile, flatItemAddition('other', ServerStrings.FileSorting.GroupNames.Other, ServerStrings.FileSorting.IconNames.Other, ServerStrings.FileSorting.GroupColors.Other))
	})
	return flattenedSortGroup.concat(flattenedOthers)

}




module.exports =  {
	getFiles: async function (directory, callback) {
		const dir = (directory === "/") ? contentDirectory : path.join(contentDirectory, `${directory}/`)
		let files
		try {
			files = await util.promisify(fs.readdir)(dir) 
		} catch (e) {
			console.error(`Could not read directory: ${e}`)
		}

		const fileList = files.map(async file =>  { 
			const fileObject = await getFileStatObject(addFilePath(dir, file))
			return {
				name: file,
				isDir: fileObject.isDirectory(),
				path: dir,
				sizeInBytes: fileObject.size,
				size: formatFileSize(convertFileSizeToHumanReadable(fileObject.size)),
				created: fileObject.birthtime,
				accessed: fileObject.atime,
				modified: fileObject.mtime,
			}
		})

		Promise.all(fileList).then(result => { 
			callback(null, createGroupedFileTypeArray(result))
		}).catch(error => {
			console.log(`Cannot retrieve file information: ${error}`)
		})

	}
} 


