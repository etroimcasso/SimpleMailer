module.exports = {
	LoadingSubscribers: null, // "Loading Subscriber List",
	SubscribersNoun: "Subscribers",
	ContentNoun: "Content",
	UnsubscribeError: (email) => `${email} is not subscribed to our mailing list`,
	UnSubscribeSuccess: (email) => `${email} has been removed from our mailing list`,
	SubscribeSuccess: (email) => `${email} has been added to our mailing list`,
	SubscribeError: (email) =>  `${email} is already subscribed`,
	GenericSubscribeResult: "You should receive an email shortly confirming your subscription / cancellation. Please check your spam folder if you do not receive an email.",
	NoSubscribers: "There are no subscribers",
	SendEmailVerb: "Send",
	TopBar: {
		MenuHeaderText: "SimpleMailer",
		ConnectionStatusPopupHeaderText: 'Connection Status',
		ConnectionText: "",
		ConnectionStatusConnected: 'Connected' ,
		ConnectionStatusDisconnected: 'Disconnected',
		MailingHistoryText: "History",
		NewMailerText: "New Mailer"
	},
	MailerModal: {
		InProgress: 'Sending Mailer',
		Completed: 'Mailer Sent',
		CompletedWithErrors: (errors, totalSubs) => `Could not send ${errors}/${totalSubs} emails.`,
		OKButtonText: 'OK',
		OKButtonWaitText: "Please Wait...",
		OKButtonFailureText: (errors, totalSubs) => `OK`
	},
	MailerResults: {
		Failure: "Could not email ",
		Success: "Sent mailer to " ,
	},
	MailerHistory: {
		NoHistory: "There is no mailer history",
		Loading: null,  //"Loading Mailer History",
		ViewEntryButtonText: 'View',
		Table: {
			Header: {
				Subject: "Subject",
				SendDate: "Date",
				SendTime: "Time",
				Recipients: "Recipients"
			},
		},
	},
	GeneralErrors: {
		NotAllEmailsSent: "Not all emails could be sent"
	}
}