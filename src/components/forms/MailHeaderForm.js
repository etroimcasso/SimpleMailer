//This form handles the mail headers
import React, { Component } from 'react';

export default class MailHeaderForm extends Component {
	state = {
		senderName: "",
		senderEmail: "",
		replyTo: "",
		subject: "",
		receivers: "",
		ccReceivers: "",
		bccReceiver: "",
		bodyText: "",
		bodyHTML: "",

	}
}