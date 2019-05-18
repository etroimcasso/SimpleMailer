let ascendingNumericalArray = index => index + 1

module.exports = {
	createAscendingNumericalArray: (length) => [...Array(length).keys()].map(ascendingNumericalArray),

}