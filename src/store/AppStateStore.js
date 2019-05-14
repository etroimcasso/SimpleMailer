export default class AppStateStore {
	@observable connection = false;
	@observable subscriberInfoModalOpen = false;
	@observable subscriberInfoMessage = "";
    @observable subscriberError = false;
    @observable mailerBeingSent = false;


	setConnectionDisabled() {
		this.connection = false
	}

	setConnectionEnabled() {
		this.connection = true
	}

	setSubscriberInfoModalOpen() {
		this.subscriberInfoModalOpen = true
	}

	setSubscriberInfoModalOpen() {
		this.subscriberInfoModalOpen = false
	}

	setSubscriberError(error) {
		this.subscriberError = error
	}

	setSubscriberInfoMessage(message) {
		this.subscriberInfoMessage = message
	}


}

