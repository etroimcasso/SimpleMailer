module.exports = {
	AppTitle: "SimpleMailer",
	PageTitles: {
		NewMailer: "New Mailer",
		History: "History",
		Subscriptions: "Subscriptions",
		FileManager: "Files",
	},
	LoadingSubscribers: null, // "Loading Subscriber List",
	SubscribersNoun: "Subscribers",
	SubjectNoun: "Subject",
	ContentNoun: "Content",
	EmailNoun: "Email",
	UnsubscribeError: (email) => `${email} is not subscribed to our mailing list`,
	UnSubscribeSuccess: (email) => `${email} has been removed from our mailing list`,
	SubscribeSuccess: (email) => `${email} has been added to our mailing list`,
	SubscribeError: (email) =>  `${email} is already subscribed`,
	GenericSubscribeResult: "You should receive an email shortly confirming your subscription / cancellation. Please check your spam folder if you do not receive an email.",
	NoSubscribers: "There are no subscribers",
	NoFiles: "There are no files",
	NoConnection: "No Connection to Server",
	SendEmailVerb: "Send",
	AddSubscriberVerb: "Add",
	SubscriptionsPanel: {
		Table: {
			Header: {
				Email: "Email",
				JoinDate: "Join Date",
			},
		},
		ConfirmDeleteMessage: "Are you sure?",
		DeleteButtonText: "Unsubscribe",
		ConfirmDeleteButtonText: "Confirm Unsubscribe",
		SubscriberEmailInputPlaceholder: "Enter Email(s)",
	},
	TopBar: {
		ConnectionStatusPopupHeaderText: 'Connection Status',
		ConnectionText: "",
		ConnectionStatusConnected: 'Connected' ,
		ConnectionStatusDisconnected: 'Disconnected',
		MailingHistoryText: "History",
		NewMailerText: "New Mailer",
		SubscribersText: "Subscribers",
		FileManagerText: "Files"
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
		NoHistory: "There are no previous mailers",
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
	},
	FileManager: {
		RootDirectoryBreadcrumbName: 'Home',
		EmptyDirectory: "This directory is empty",
		Toolbar: {
			PreviousDirectory: "Back",
			HomeDirectory: "Home"
		},
		SortMenu: {
			MenuHeader: 'Sort:',
			MenuNames: {
				Abc: 'A - Z',
				Zyx: 'Z - A',
				Newest: 'Newest',
				Oldest: 'Oldest',
				Largest: 'Largest',
				Smallest: 'Smallest',
				DirectoriesFirst: {
					Name: "Directories First",
					Yes: "Yes",
					No: "No",
				}
			}
		},
		FilterMenu: {
			MenuHeader: 'Show:',
			ResetFiltersText: 'Show All',
			FilterOutAllText: 'Hide All',
		},
		FSErrorMessages: {
			FileExists: (file) => `${file} already exists`,
			NameTooLong: 'The filename is too long',
		},
		NewDirectoryModal: {
			Header: 'New Directory',
			InputPlaceholder: 'New directory name',
			OKButtonText: 'Create Directory',
			CancelButtonText: 'Cancel',
		}
	},
	LoginPage: {
		UsernameText: 'Username',
		PasswordText: 'Password',
		SignInButtonText: 'Sign In',
		NewAccountButtonText: 'Create Account',
	}
}