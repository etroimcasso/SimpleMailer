/*
	Index will track the unit:
	0: B , for when the initial value is > 4 digits - bytes has no decimal
	1: KB
	2: MB <--Should probably never proceed past this on the internet for years to come when it's just mailing list content 
	3: GB
	4: TB
*/
const getFileSizeSuffix = (index) => {
	switch(index) {
		case 0:
			return "B"
		case 1:
			return "KB"
		case 2:
			return "MB"
		case 3:
			return "GB"
		case 4:
			return "TB"
		case 5:
			return "PB"
		case 6:
			return "EB"
		default:
			return ""
	}
}

export default class FilesHelper {

	//To do this, I need to analyze the string in reverse using a right fold, and stop once it finds a . 
	// Accumulator should add next object to the beginning instead of end of itself, so ++accumulator, instead of accumulator++ kind of thing
	//filename is a string, convert it to character array so it can be reduced
	//getFileExtension: (filename) => filename.split('').reduceRight((accumulator, currentValue, index, array) => (currentValue === ".") ? accumulator = array.slice(index + 1) : accumulator ),
	//This might be even easier if I just split the file along dots and then take the value of that array.length - 1

	getFileExtension = (filename) => filename.split('.')[filename.split('.').length - 1]

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
	convertFileSizeToHumanReadable = (filesize) => ([...Array(6).keys()].map(_ => 0)).reduce((acc, cv, index2) => (acc.size.toString().split('.')[0].length <= 3) ? acc : acc = { size: acc.size / 1024, unit: getFileSizeSuffix(index2 + 1)}, { size: filesize, unit: getFileSizeSuffix(0) })


}
