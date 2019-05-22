const fs = require('fs');
const path = require('path');
const contentDirectory = path.join(__dirname,'../../../mailerContent/')
const util = require('util');
const FileTypeGroups = require('../../config/FileTypeGroups')


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
	//console.log(`filename ${filename}`)
	const splitName = filename.split('.')
	const splitLength = splitName.length
	return (splitLength === 1) ? "" : `.${splitName[splitLength - 1]}`
}

//Collect all but the last item in the array
const getFileName =  (filename) => {
	//return getFileNameWithDotSupport(filename)
	return filename.split('.').reduce((accumulator, currentValue, index, array) => (index >= array.length - 2) ? accumulator : accumulator.concat(currentValue))
}

const getFileNameWithDotSupport = (filename) => filename.split('.').reduce((accumulator, currentValue, index, array) => (index >= array.length - ((array[0] === '') ? 1: 2)) ? accumulator : accumulator.concat(currentValue))



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
	//const iterations = [...Array(6).keys()].map(index => index + 1)
const convertFileSizeToHumanReadable = (filesize) => {
	const fileSizeSuffixes = ["B","KB","MB","GB","TB","PB","EB"]
	const reduceFunc = (acc, cv, index) => (acc.size.toString().split('.')[0].length <= 3) ? acc : acc = { size: acc.size / 1024, unit: fileSizeSuffixes[index + 1]}
	return fileSizeSuffixes.reduce(reduceFunc, { size: filesize, unit: fileSizeSuffixes[0] })
}

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
const extensionsMatch = (file, extension) => getFileExtension(file.name) === extension


const createGroupedFileTypeArray = (fileList) => {
	//Doesn't include provision for dot files with file extensions -- TODO
	//THIS FILTER FUNCTION HAS A SERIOUS BUG --- NEEDS REWORKING
	const oldFilterFunc = (currentFile, fileExtension, sortType) => 
		(extensionsMatch(currentFile.name, fileExtension) && !isDirectory(currentFile)) 
			? true 
				: (currentFile.isDir)
					? ((sortType.type === 'directory') ? true : false)
					: (getFileExtension(currentFile.name).length === 0) 
						? (getFileName(currentFile.name).length === 0)
								? false //No file name, no file extension
								: ((sortType.type === 'none' && !currentFile.isDir)  
									? true 
									:  false   )//No file extension
						: (getFileName(currentFile.name).length === 0 )  //File extension
							? ((sortType.type === 'none')  
									? true
									: false) //File extension, no name
								: false

	const newFilterFunc = (currentFile, fileExtension, sortType) => {
	//If directory, add entry ONLY if the sortType is directory
	//If it's a dot file, use getFileExtension on it to get the file extension
	//	From there use the normal thing
	//if it's not a dot file, use the standard procedure of file extension matching
		if (isDirectory(currentFile) ) {
			if (sortType.type === 'directory') return true
			else return false 
		} else if (noExtension(currentFile)) {
			if (sortType.type === 'none') return true
			else return false
		}
		else { //Directories are excluded
			if (isDotFile(currentFile)) {
				if (extensionsMatch(currentFile, fileExtension)) return true
				else return false
			}
			if (extensionsMatch(currentFile, fileExtension)) return true
			else return false
		}

	}

	const groupedFilesWithoutOthers = FileTypeGroups.map(sortType => {
		return { 
			type: sortType.type, 
			files: sortType.extensions.map(fileExtension => fileList.filter(currentFile => newFilterFunc(currentFile, fileExtension, sortType))).reduce((acc, cv)=> acc.concat(cv))
		}
	})
	const flattenedSortGroup = groupedFilesWithoutOthers.reduce((flattenedList, sortGroup) => flattenedList.concat(sortGroup.files.map(currentFile => Object.assign(currentFile, { type: sortGroup.type }))), [])

	//combine flattenedSortGroup with fileList
	//filter out all that have a non-null type property

	const combinedList = flattenedSortGroup.concat(fileList)
	const otherFiles = { 
		type: 'other',
		files: combinedList.filter(item => !item.type).map(file => file)
	}		

	return groupedFilesWithoutOthers.concat(otherFiles)


}




module.exports =  {
	getFiles: async function (directory, grouped, callback) {
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
			//console.log(result)
			//console.log(`###############################`)
			//console.log(`DIRECTORY CHANGE: ${dir}`)
			//console.log(createGroupedFileTypeArray(result).map(item => { return { type: item.type, files: item.files.map(file => file ).length } } ))
			//console.log('TOTAL FILES')
			//console.log(createGroupedFileTypeArray(result).reduce((acc, cv, index) => acc + cv.files.length ,0))
			callback(null, (grouped) ? createGroupedFileTypeArray(result) : result)
		}).catch(error => {
			console.log(`Cannot retrieve file information: ${error}`)
		})

	}
} 


