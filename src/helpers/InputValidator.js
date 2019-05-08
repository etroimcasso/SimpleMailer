module.exports = {
	//Returns boolean
	fieldIsEmpty: (text) => text === null || text.length <= 0 || text === "",
	fieldIsMinimumLength:  (text, minLength) =>  text.length >= minLength,
	//Returns true if text.length is greater than maxLength
	fieldExceedsMaximumLength:  (text, maxLength) => text.length > maxLength,
	fieldIsValidEmail: (text) => {
		var regexp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
		return regexp.test(String(text).toLowerCase());
	},
}