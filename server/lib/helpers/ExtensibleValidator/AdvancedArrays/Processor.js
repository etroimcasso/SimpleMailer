//Array Processor
module.exports = {
	sum: (array) =>  array.reduce((accumulator, currentValue) => accumulator + currentValue),
	product: (array) =>  array.reduce((accumulator, currentValue) => accumulator * currentValue),
	difference: (array) =>  array.reduce((accumulator, currentValue) => accumulator - currentValue),
}