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
		console.log(`Can't get file stats for ${filePath}: ${e}`)
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
const getFileName =  (filename) => filename.split('.').reduce((accumulator, currentValue, index, array) => (index >= array.length - 2) ? accumulator : accumulator.concat(currentValue))


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


const createGroupedFileTypeArray = (fileList) => {
	//Doesn't include provision for dot files with file extensions -- TODO
	//THIS FILTER FUNCTION HAS A SERIOUS BUG --- NEEDS REWORKING
	const filterFunc = (currentFile, fileExtension, sortType) => 
		(getFileExtension(currentFile.name) === fileExtension && !currentFile.isDir) 
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
	const groupedFilesWithoutOthers = FileTypeGroups.map(sortType => {
		return { 
			type: sortType.type, 
			files: sortType.extensions.map(fileExtension => fileList.filter(currentFile => filterFunc(currentFile, fileExtension, sortType))).reduce((acc, cv)=> acc.concat(cv))
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
			//need to construct object { name: , sizeInBytes: }
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
			console.log(`###############################`)
			console.log(`DIRECTORY CHANGE: ${dir}`)
			console.log(createGroupedFileTypeArray(result).map(item => { return { type: item.type, files: item.files.map(file => console.log(file.name)) } } ))
			console.log('TOTAL FILES')
			console.log(createGroupedFileTypeArray(result).reduce((acc, cv, index) => acc + cv.files.length ,0))
			callback(null, (grouped) ? createGroupedFileTypeArray(result) : result)
		}).catch(error => {
			console.log(`Cannot retrieve file information: ${error}`)
		})

	}
} 


