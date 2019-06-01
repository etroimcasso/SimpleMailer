import {decorate, observable, action, computed } from "mobx"
import openSocket from 'socket.io-client';
import { EditorState } from 'draft-js';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
const hostname = require('../config/hostname.js');
const socket = openSocket(hostname.opensocket);

const convertRawEditorContentToHTML = (rawContent) => draftToHtml(rawContent)

  class AppStateStore {
      subscriberInfoModalOpen = false
      subscriberInfoMessage = ""
      mailerBeingSent = false
      mailerProgressModalOpen = false
      mailerResults = []
      editorState = observable.box(EditorState.createEmpty())
      subject = observable.box('')

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

      setSubject(newSubject) {
        this.subject.set(newSubject)
      }

      get getSubject() {
        return this.subject.get()
      }

      clearMailerResults() {
        this.mailerResults = this.mailerResults.filter((item) => null)
      }

      setEditorState(newState) {
        this.editorState.set(newState)
      }

      get editorStateObject() {
        return this.editorState.get()
      }

      get plainTextContent() {
        const currentContent = this.editorState.get().getCurrentContent()
        return currentContent.getPlainText()

      }

      get htmlContent() {
        const currentContent = this.editorState.get().getCurrentContent()
        const rawContent = convertToRaw(currentContent)
        return convertRawEditorContentToHTML(rawContent)
      }


  }

export default decorate(AppStateStore, {
	subscriberInfoModalOpen: observable,
  editorState: observable,
	subscriberInfoMessage: observable,
	mailerBeingSent: observable,
  mailerProgressModalOpen: observable,
  subject: observable,
  mailerResults: observable,
	setMailerBeingSent: action,
	setSubscriberInfoModalOpen: action,
	setSubscriberInfoMessage: action,
	setMailerProgressModalOpen: action,
  addMailerResult: action,
  mailerResultsCount: computed,
  clearMailerResults: action,
  ongoingMailerResults: computed,
  setEditorState: action,
  editorStateObject: computed,
  plainTextContent: computed,
  htmlContent: computed,
  setSubject: action,
  getSubject: computed
})