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
	},
	FileSorting: {
		GroupNames: {
			Images: 'Images',
			Videos: 'Videos',
			PDF: 'PDF',
			Word: 'Word Documents',
			Excel: 'Spreadsheets',
			Powerpoint: 'Presentations',
			Text: 'Text',
			NoExtension: 'No Extension',
			Directories: 'Directories',
			Coding: 'Code Files',
			Executables: 'Executables',
			Archives: 'Archives',
			Other: 'Others'
		},
		GroupColors: {
			Images: 'teal',
			Videos: null,
			PDF: 'red',
			Word: 'blue',
			Excel: 'green',
			Powerpoint: 'orange',
			Text: null,
			NoExtension: null,
			Directories: 'yellow',
			Coding: 'purple',
			Executables: null,
			Archives: 'pink',
			Other: null,
		},
		IconNames: {
			Images: 'file image outline',
			Videos: 'file video outline',
			PDF: 'file pdf outline',
			Word: 'file word outline',
			Excel: 'file excel outline',
			Powerpoint: 'file powerpoint outline',
			Text: 'file alternate outline',
			NoExtension: 'file outline',
			Directories: 'folder',
			Coding: 'file code outline',
			Executables: 'file outline',
			Archives: 'file archive outline',
			Other: 'file outline'
		},
	}
}