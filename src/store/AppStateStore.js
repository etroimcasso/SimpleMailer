  import {decorate, observable, action, computed } from "mobx"
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
        this.mailerResults = Array.from(new Set(this.mailerResults.map(a => a.email)))
             .map(email => {
               return this.mailerResults.find(a => a.email === email)
             })
      }

      get mailerResultsCount() {
        return this.mailerResults.length
      }
      get ongoingMailerResults() {
        return this.mailerResults

      }

      clearMailerResults() {
        this.mailerResults = this.mailerResults.filter((item) => null)        
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
  mailerResultsCount: computed,
  clearMailerResults: action,
  ongoingMailerResults: computed
})