/*
	Index will track the unit:
	0: B , for when the initial value is > 4 digits - bytes has no decimal
	1: KB
	2: MB <--Should probably never proceed past this on the internet for years to come when it's just mailing list content 
	3: GB
	4: TB
*/

//Gives a unique

const uniqueArray = (list) => list.filter((item,index) => {
		  return index === list.findIndex(obj => {
		    return obj === item;
		  })
		})	

export default class FilesHelper {
	
	//To do this, I need to analyze the string in reverse using a right fold, and stop once it finds a . 
	// Accumulator should add next object to the beginning instead of end of itself, so ++accumulator, instead of accumulator++ kind of thing
	//filename is a string, convert it to character array so it can be reduced
	//getFileExtension: (filename) => filename.split('').reduceRight((accumulator, currentValue, index, array) => (currentValue === ".") ? accumulator = array.slice(index + 1) : accumulator ),
	//This might be even easier if I just split the file along dots and then take the value of that array.length - 1

	getFileExtension = (filename) => {
		//console.log("file to split: ")
		//console.log(filename)
		const splitName = filename.split('.')
		const splitLength = splitName.length
		return (splitLength === 1) ? "" : `.${splitName[splitLength - 1]}`
	}

	//Collect all but the last item in the array
	getFileName =  (filename) => filename.split('.').reduce((accumulator, currentValue, index, array) => (index >= array.length - 2) ? accumulator : accumulator.concat(currentValue))

	
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
	convertFileSizeToHumanReadable = (filesize) => {
		const fileSizeSuffixes = ["B","KB","MB","GB","TB","PB","EB"]
		const reduceFunc = (acc, cv, index) => (acc.size.toString().split('.')[0].length <= 3) ? acc : acc = { size: acc.size / 1024, unit: fileSizeSuffixes[index + 1]}
		return fileSizeSuffixes.reduce(reduceFunc, { size: filesize, unit: fileSizeSuffixes[0] })
	}

	//Will parse through file list, generating an array of file types (images, text, archives, pdfs, etc) that are present in the list.
	//This will need an array of file types with file extensions as children.
	//This is going to be a complex function
	createGroupedFileTypeArray = (fileList) => {
		const sortTypes = [
			{
				type: "images",
				extensions: ['.jpg','.jpeg','.jfif','.png','.gif','.bmp']
			},
			{
				type: "pdf",
				extensions:['.pdf']
			},
			{
				type: "text",
				extensions: ['.txt','.rtf']
			},
			{
				type: "web",
				extensions: ['.html']
			},
			{
				type: "none",
			 	extensions: ['']
			},
			{ 
				type: "directory",
				extensions: ['']
			}

		]

		const filterFunc = (currentFile, fileExtension, sortType) => 
			(this.getFileExtension(currentFile.name) === fileExtension && !currentFile.isDir) 
				? true 
					: (currentFile.isDir)
						? ((sortType.type === 'directory') ? true : false)
						: (this.getFileExtension(currentFile.name).length === 0) 
							? (this.getFileName(currentFile.name).length === 0)
									? false //No file name, no file extension
									: ((sortType.type === 'none')  
										? true 
										: false )//No file extension
								: (this.getFileName(currentFile.name).length === 0 )  //File extension
									? ((sortType.type === 'none')  
										? true
										: false) //File extension, no name
									: false

		const groupedFilesWithoutOthers = sortTypes.map(sortType => {
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
		//return new Set(flattenedSortGroup,fileList)


		//TO GET OTHERS TYPE
		// Take resulting sorted list, and create a new list by filtering out all objects that exist in the other list
		//OR make a set from the sortedFilteredList and the fileList, then combine that set with the rest of the sortedFileList
		//EVERYTHING NOT IN SORTED FILE LIST NEEDS TO BE IN THE 'OTHER' CATEGORY
		//flatten sortedList down to just filenames, and compare that against the unsorted list and filter out all items that are in both lists



		/* THIS WOULD BE WAY EASIER: MAYBE NOT THOUGH
		Simply insert a "type: ..." property into each fileList entry
		then in the interface, use an array of types like this here using the TYPE property of each file, so basically create 
		*/

	}
	


}
