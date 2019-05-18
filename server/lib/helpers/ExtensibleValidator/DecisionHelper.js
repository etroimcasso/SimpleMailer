import { lazy } from 'lazy-arr'

const ArrayGenerator = require('./AdvancedArrays/Generator')
const ArrayProcessor = require('./AdvancedArrays/Processor')

//lazy-arr enables the use of lazy evaluation in arrays

module.exports = {

	//Generates and returns an array of (length) with the integer for each decision case's true result
	//Decision truth values are assigned in such that no combination of any two values results in the same result. 
	//   No two results should ever overlap
	//These truth values are the same as the values for binary positions, ie. 2 to the power of n.
	generateInitialDecisionArray: (length) => {
		let decisionArrayFoldFunction = index => 2 ** index
		let generateAscendingNumericalArray = index => index + 1
		let lazyArray = lazy([0])(decisionArrayFoldFunction)
		//Generate index # array from length. Used to provide iteration to lazy array
		let indexArray = ArrayGenerator.createAscendingNumericalArray(length)
		//Generates the final array from index array's values
		return indexArray.map((index) => lazyArray[index])
	}
	
	//Resets all values in the (array) to 0 and returns the new array
	//resetArrayValuesToZero

}
