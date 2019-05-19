const fs = require('fs');
const path = require('path');
const contentDirectory = path.join(__dirname,'../../../mailerContent/')
const util = require('util');

//Reduces fsStatObject to a filesize by calculating block size * blocks
calculateFileSize = (fsStatObject) => fsStatObject.size

getFileStatObject = async function (filePath) { 
	let fsStat
	try {
		fsStat = await util.promisify(fs.stat)(filePath)
	} catch (e) {
		console.log(`Can't get file stats for ${filePath}: ${e}`)
	}
	return fsStat
}

addFilePath = (path, file) => `${path}${file}`

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
			//need to construct object { name: , sizeInBytes: }
				name: file,
				isDir: fileObject.isDirectory(),
				path: dir,
				sizeInBytes: calculateFileSize(fileObject),
				created: fileObject.birthtime,
				accessed: fileObject.atime,
				modified: fileObject.mtime,
			}
		})

		Promise.all(fileList).then(result => { 
			//console.log(result)
			callback(null, result)
		}).catch(error => {
			console.log(`Cannot retrieve file information: ${error}`)
		})

	}
} 


