module.exports = {
	LoadingSubscribers: "Loading Subscriber List",
	SubscribersNoun: "Subscribers",
	UnsubscribeError: (email) => `${email} is not subscribed to our mailing list`,
	UnSubscribeSuccess: (email) => `${email} has been removed from our mailing list`,
	SubscribeSuccess: (email) => `${email} has been added to our mailing list`,
	SubscribeError: (email) =>  `${email} is already subscribed`,
	TopBar: {
		MenuHeaderText: "SimpleMailer",
		ConnectionStatusPopupHeaderText: 'Connection Status',
		ConnectionText: "",
		ConnectionStatusConnected: 'Connected' ,
		ConnectionStatusDisconnected: 'Disconnected',
	},
	MailerModal: {
		InProgress: 'Sending Mailer',
		Completed: 'Mailer Sent',
		OKButtonText: 'All Sent!',
		OKButtonWaitText: "Please Wait..."
	},
	MailerResults: {
		Failure: "Could not email ",
		Success: "Sent mailer to " ,
	}
}