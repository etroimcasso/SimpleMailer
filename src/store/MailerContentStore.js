import { decorate, observable, action, computed } from "mobx"
import openSocket from 'socket.io-client';
const hostname = require('../config/hostname.js');
const socket = openSocket(hostname.opensocket);
//const ReconnectionTimer = require('../helpers/ReconnectionTimer');

//Needs to store an array of the file contents of the mailerContent directory.
//Should respond to events 'mailerContentFileAdded' and 'mailerContentFileRemoved' to change contents of list
//Should filter out testContent.txt
//Should contain state of loading like Subscribers and MailerHistory do
//Loading state is set to completed when file contents are 0 (including testContent.txt being filtered out)
//Loading state is set to completed when receives event 'getMailerContentsListingResults' 
//Should compute an array that contains arrays of files organized into types using filters 

let noTestContentFilterRule = (item) => item.name !== 'testContent.txt'


class MailerContentStore {
	mailerContentFiles = []
	mailerContentFilesLoaded = false
	reloadMailerContentsFilesPending = true

	constructor() {
		socket.on('connect', () => {
			if(this.reloadMailerContentsFilesPending) this.getMailerContentsFiles()
		})

		socket.on('disconnect', () => {
			this.setReloadFilesPending(true)
		})

		socket.on('mailerContentFileAdded', (file) => this.addFile(file))
		socket.on('mailerContentFileRemoved', (file) => this.removeFile(file))
	}

	dispatchGetAllMailerContentFilesSocketMessage(callback) {
		socket.on('getMailerContentFilesResults', (error, files) => callback(error, files))
		socket.emit('getMailerContentFiles')
	}


	getMailerContentsFiles() {
		this.dispatchGetAllMailerContentFilesSocketMessage((error, files) => {
			if (!error) {
				this.clearFilesList()
				this.replaceFilesList(this.filterOutTestContent(files))
				//this.replaceFilesList(files)
			}
			this.setFilesLoaded(true)
			this.setReloadFilesPending(false)
		})
	}

	filterOutTestContent = (list) => list.filter(noTestContentFilterRule)
	replaceFilesList = (newList) => this.mailerContentFiles = newList
	clearFilesList = () => this.mailerContentFiles = this.mailerContentFiles.filter((item) => null)
	addFile = (file) => this.mailerContentFiles = this.mailerContentFiles.concat(file)
	removeFile = (file) => this.mailerContentFiles = this.mailerContentFiles.filter((item) => item !== file)
	setFilesLoaded = (loaded) => this.mailerContentFilesLoaded = loaded
	setReloadFilesPending = (pending) => this.reloadMailerContentsFilesPending = pending

	get sortedFileList() {
		//This is for later
	}

	get filesCount() { return this.mailerContentFiles.length }



}

export default decorate(MailerContentStore, {
	mailerContentFiles: observable,
	mailerContentFilesLoaded: observable,
	reloadMailerContentsFilesPending: observable,
	getMailerContentsFiles: action,
	replaceFilesList: action,
	clearFilesList: action,
	setFilesLoaded: action,
	setReloadFilesPending: action,
	addFile: action,
	removeFile: action,
	sortedFileList: computed,
	filesCount: computed
})
