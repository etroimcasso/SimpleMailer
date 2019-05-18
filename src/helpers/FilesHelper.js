module.exports = {
	//To do this, I need to analyze the string in reverse using a right fold, and stop once it finds a . 
	// Accumulator should add next object to the beginning instead of end of itself, so ++accumulator, instead of accumulator++ kind of thing
	//filename is a string, convert it to character array so it can be reduced
	//getFileExtension: (filename) => filename.split('').reduceRight((accumulator, currentValue, index, array) => (currentValue === ".") ? accumulator = array.slice(index + 1) : accumulator ),
	//This might be even easier if I just split the file along dots and then take the value of that array.length - 1

	getFileExtension: (filename) => filename.split('.')[filename.split('.').length - 1],

	//getFileName: (filename) => filename.split('').reduceRight((accumulator, currentValue, index, array) => (currentValue === ".") ? accumulator = array.slice(0, index - 1) : accumulator ),

	//Collect all but the last item in the array
	getFileName: (filename) => filename.split('.').reduce((accumulator, currentValue, index, array) => (index >= array.length - 2) ? accumulator : accumulator.concat(currentValue))

}
