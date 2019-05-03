const hostnames = require('../../src/config/hostname.js')

const unsubscribeLink = (email, unsubscribeId) => `${hostnames.unsubscribeHost}/unsubscribe/${email}/${unsubscribeId}`
module.exports = {
	UnsubScribePlainText: (email, unsubscribeId) => `\n\n\n If you wish to unsubscribe, visit ${unsubscribeLink(email, unsubscribeId)}`,
	UnsubscribeHTML: (email, unsubscribeId) => `<p>If you wish to unsubscribe, visit <a href="${unsubscribeLink(email, unsubscribeId)}">${unsubscribeLink(email, unsubscribeId)}${email}/${unsubscribeId}</a></p>`
}