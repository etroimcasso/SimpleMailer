  import {decorate, observable, action } from "mobx"
  import openSocket from 'socket.io-client';
  const hostname = require('../config/hostname.js');
  const socket = openSocket(hostname.opensocket);

  class AppStateStore {
      subscriberInfoModalOpen = false
      subscriberInfoMessage = ""
      mailerBeingSent = false
      mailerProgressModalOpen = false
      mailerResults = []

      constructor() {
          socket.on('sendMailerFinished', () => {
              this.setMailerBeingSent(false)
          })

      }


      setMailerBeingSent(isBeingSent) {
          this.mailerBeingSent = isBeingSent
      }

      setSubscriberInfoModalOpen(isOpen) {
          this.subscriberInfoModalOpen = isOpen
      }

      setSubscriberInfoMessage(message) {
          this.subscriberInfoMessage = message
      }

      setMailerProgressModalOpen(isOpen) {
      	this.mailerProgressModalOpen = isOpen
      }

      addMailerResult(result) {
        this.mailerResults = this.mailerResults.concat(result)
      }

      replaceMailerResults(result) {
        this.mailerResults = result
      }
  }
export default decorate(AppStateStore, {
	subscriberInfoModalOpen: observable,
	subscriberInfoMessage: observable,
	mailerBeingSent: observable,
    mailerProgressModalOpen: observable,
    mailerResults: observable,
	setMailerBeingSent: action,
	setSubscriberInfoModalOpen: action,
	setSubscriberInfoMessage: action,
	setMailerProgressModalOpen: action,
  addMailerResult: action,
  replaceMailerResults: action
})