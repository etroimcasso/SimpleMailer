  import {decorate, observable, action } from "mobx"
  import openSocket from 'socket.io-client';
  const hostname = require('../config/hostname.js');
  const socket = openSocket(hostname.opensocket);

  class AppStateStore {
      subscriberInfoModalOpen = false
      subscriberInfoMessage = ""
      subscriberError = false
      mailerBeingSent = false
      subscribersLoaded = false
      reloadSubscribersPending = false
      mailerProgressModalOpen = false
      mailerHistoryLoaded = false
      reloadMailerHistoryPending = false
      mailerHistoryResultsLoaded = false
      reloadMailerHistoryResultsPending = false

      constructor() {
          socket.on('connect', () => {
              if (this.reloadSubscribersPending) {
                  this.setSubscribersLoaded(false)
                      //this.getAllSubscribers()
              }
              if (this.reloadMailerHistoryPending) {
                  this.setMailerHistoryLoaded(false)
                      //this.getAllMailers()
              }
              if (this.reloadMailerHistoryResultsPending) {
                  this.setMailerHistoryResultsLoaded(false)
                      //this.getAllMailerResults()
              }
              //this.props.dispatch('CONNECTION_ENABLE')
              this.setReloadSubscribersPending(false)
              this.setReloadMailerHistoryPending(false)
          })

          socket.on('disconnect', () => {
              this.setReloadSubscribersPending(true)
              this.setReloadMailerHistoryPending(true)
              this.setReloadMailerHistoryResultsPending(true)
          })

          socket.on('disconnect', () => {
              this.setReloadMailerHistoryResultsPending(true)
          })

          socket.on('sendMailerFinished', () => {
              this.setMailerBeingSent(false)
          })

          socket.on('noSubscribers', () => {
              this.setSubscribersLoaded(true)
          })

          socket.on('noMailers', () => {
            this.setMailerHistoryLoaded(true)
            this.setReloadMailerHistoryPending(false)
          })

          socket.on('noMailerResults', () => {
            this.setMailerHistoryResultsLoaded(true)
          })
      }


      setMailerBeingSent(isBeingSent) {
          this.mailerBeingSent = isBeingSent
      }

      setReloadSubscribersPending(isPending) {
          this.reloadSubscribersPending = isPending
      }

      setMailerHistoryLoaded(isLoaded) {
          this.mailerHistoryLoaded = isLoaded
      }

      setReloadMailerHistoryPending(isPending) {
          this.reloadMailerHistoryPending = isPending
      }

      setReloadMailerHistoryResultsPending(isPending) {
          this.reloadMailerHistoryResultsPending = isPending
      }

    setMailerHistoryResultsLoaded(isLoaded) {
    	this.mailerHistoryResultsLoaded = isLoaded
    }

      setSubscriberInfoModalOpen(isOpen) {
          this.subscriberInfoModalOpen = isOpen
      }

      setSubscriberError(error) {
          this.subscriberError = error
      }

      setSubscriberInfoMessage(message) {
          this.subscriberInfoMessage = message
      }

      setSubscribersLoaded(isLoaded) {
          this.subscribersLoaded = isLoaded
      }

      setMailerProgressModalOpen(isOpen) {
      	this.mailerProgressModalOpen = isOpen
      }
  }
export default decorate(AppStateStore, {
	connection: observable,
	subscriberInfoModalOpen: observable,
	subscriberInfoMessage: observable,
	subscriberError: observable,
	mailerBeingSent: observable,
	subscribersLoaded: observable,
    reloadSubscribersPending: observable,
    mailerProgressModalOpen: observable,
    mailerHistoryLoaded: observable,
    reloadMailerHistoryPending: observable,
    mailerHistoryResultsLoaded: observable,
    reloadMailerHistoryResultsPending: observable,
	setMailerBeingSent: action,
	setReloadSubscribersPending: action,
	setMailerHistoryLoaded: action,
	setReloadMailerHistoryPending: action,
	setReloadMailerHistoryResultsPending: action,
	setMailerHistoryResultsLoaded: action,
	setSubscriberInfoModalOpen: action,
	setSubscriberError: action,
	setSubscriberInfoMessage: action,
	setSubscribersLoaded: action,
	setMailerProgressModalOpen: action,
})