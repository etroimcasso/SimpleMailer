//Array Processor
module.exports = {
	toSum: function(arr) {
		return arr.reduce((total, amount) => total + amount)
	},

	toProduct: function(arr) {
		return arr.reduce((total, amount) => total * amount)
	},

	toDifference: function(arr) {
		return arr.reduce((total, amount) => total - amount)
	},

}