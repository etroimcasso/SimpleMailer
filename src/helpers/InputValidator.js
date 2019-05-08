module.exports = {
	//Returns boolean
	fieldIsEmpty: function (text) {
		return text === null || text.length <= 0 || text === ""
	},
	fieldIsMinimumLength: function (text, minLength) {
		return text.length >= minLength
	},
	//Returns true if text.length is greater than maxLength
	fieldExceedsMaximumLength: function (text, maxLength) {
		return text.length > maxLength
	},
	fieldIsValidEmail: function (text) {
		var regexp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
		return regexp.test(String(text).toLowerCase());
	},
}