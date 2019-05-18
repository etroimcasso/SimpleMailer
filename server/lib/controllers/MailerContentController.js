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
	console.log("FSSTAT")
	console.log(fsStat)

	return fsStat
}

addFilePath = (file) => `${contentDirectory}${file}`

module.exports =  {
	getFiles: async function (callback) {
		let files
		try {
			files = await util.promisify(fs.readdir)(contentDirectory) 
		} catch (e) {
			console.error(`Could not read directory: ${e}`)
		}

		const fileList = files.map(async file =>  { 
			return {
			//need to construct object { name: , sizeInBytes: }
			name: file,
			path: contentDirectory,
			sizeInBytes: calculateFileSize(await getFileStatObject(addFilePath(file)))
			}
		})

		Promise.all(fileList).then(result => { 
			console.log(result)
			callback(null, result)
		}).catch(error => {
			console.log(`Cannot retrieve file information: ${error}`)
		})

	}
} 


