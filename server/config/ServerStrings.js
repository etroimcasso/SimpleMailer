const hostnames = require('../../src/config/hostname.js')

const unsubscribeLink = (email, unsubscribeId) => `${hostnames.unsubscribeHost}/unsubscribe/${email}/${unsubscribeId}`
module.exports = {
	UnsubScribePlainText: (email, unsubscribeId) => `\n\n\n If you wish to unsubscribe, visit ${unsubscribeLink(email, unsubscribeId)}`,
	UnsubscribeHTML: (email, unsubscribeId) => `<p>If you wish to unsubscribe, visit <a href="${unsubscribeLink(email, unsubscribeId)}">${unsubscribeLink(email, unsubscribeId)}</a></p>`,
	WelcomeSubscriberEmail: {
		Subject: (email) => `Rx4Pain -- ${email} has been added to our mailing list`,
		BodyText: (email, unsubscribeId) => `Your email address ${email} has been added to the Rx4Pain mailing list. \n\n\n If you wish to unsubscribe, visit ${unsubscribeLink(email, unsubscribeId)}`,
	},
	UnsubscribeEmail: {
		Subject: (email) => `Rx4Pain -- ${email} has been removed from our mailing  list`,
		BodyText: (email) => `Your email address ${email} has been removed from the Rx4Pain mailing  list.`,
	}
}