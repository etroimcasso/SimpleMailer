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
			PDF: 'PDF Documents',
			Word: 'Word Documents',
			Excel: 'Excel Spreadsheets',
			Powerpoint: 'Powerpoint Presentations',
			Text: 'Text Documents',
			NoExtension: 'No Extension',
			Directories: 'Directories',
			Coding: 'Code Files',
			Executables: 'Executables',
			Archives: 'Archives',
			Other: 'Others'
		},
		GroupColors: {
			Images: null,
			Videos: null,
			PDF: 'red',
			Word: 'blue',
			Excel: 'green',
			Powerpoint: 'red',
			Text: null,
			NoExtension: null,
			Directories: 'orange',
			Coding: null,
			Executables: null,
			Archives: null,
			Other: null,
		},
		IconNames: {
			Images: 'file image outline',
			Videos: 'file video outline',
			PDF: 'file pdf',
			Word: 'file word outline',
			Excel: 'file excel',
			Powerpoint: 'file powerpoint',
			Text: 'file alternate',
			NoExtension: 'file',
			Directories: 'folder',
			Coding: 'file code',
			Executables: 'file',
			Archives: 'file archive',
			Other: 'file'
		},
	}
}