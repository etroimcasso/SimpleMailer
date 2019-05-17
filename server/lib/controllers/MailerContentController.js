const fs = require('fs');
const path = require('path');
const contentDirectory = path.join(__dirname,'../../../build/mailerContent/')

module.exports =  {
	//Path relative to 
	getFiles: (callback) => {
		fs.readdir(contentDirectory, (error, files) => {
			if (error) return callback(error, null)
			else return callback(null, files)
		})
	}
} 


