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



class FileSystemStore {
	fileListing = []
	fileListingLoaded = false
	reloadFileListingPending = true
	directory = observable.box("/")


	constructor() {
		socket.on('connect', () => {
			if(this.reloadFileListingPending) this.getFileListing()
		})

		socket.on('disconnect', () => {
			this.setReloadFilesPending(true)
		})

		socket.on('fileAdded', (file) => this.addFile())
		socket.on('fileRemoved', (file) => this.removeFile())

	}

	dispatchGetFileListingSocketMessage(fileDir, callback) {
		socket.on('getFileListingResults', (error, files) => callback(error, files))
		socket.emit('getFileListing', fileDir)
	}

	getFileListing() {
		this.dispatchGetFileListingSocketMessage(this.directory.get(), (error, files) => {
			if (!error) {
				this.clearFilesList()
				this.replaceFilesList(this.filterOutTestContent(files))
			}
			this.setFilesLoaded(true)
			this.setReloadFilesPending(false)
		})
	}


	filterOutTestContent = (list) => list.filter(noTestContentFilterRule)
	replaceFilesList = (newList) => this.fileListing = newList
	clearFilesList = () => this.fileListing = this.fileListing.filter((item) => null)
	addFile = (file) => this.fileListing = this.fileListing.concat(file)
	removeFile = (file) => this.fileListing = this.fileListing.filter((item) => item !== file)
	setFilesLoaded = (loaded) => this.fileListingLoaded = loaded
	setReloadFilesPending = (pending) => this.reloadFileListingPending = pending

	

	setDirectory = (dir) => {
		this.directory.set(dir)
		this.getFileListing()
	}

	resetDirectory = () => {
		this.directory.set("/")
	}

	get sortedFileList() {
		//This is for later
	}

	get filesCount() { return this.fileListing.length }

	get currentDirectory() { return this.directory.get() }

	get pathArray() { return this.directory.get().split('/').filter(item => item !== "") }

	openDirectory(filename) {
		const currentDirectory = this.directory.get()
		const newDirectory = (currentDirectory === '/') ? `/${filename}/` :`${currentDirectory}${filename}/`
		this.setDirectory(newDirectory)
	}

	openParentDirectory = () => {
		const pathArray = this.pathArray
		const reduceFunc = (accumulator, currentValue, index, array) => (index >= array.length - 1) ? accumulator : `${accumulator}${currentValue}/`
		const newDirectory = pathArray.reduce(reduceFunc, '/')
		this.setDirectory(newDirectory)
	}


}

export default decorate(FileSystemStore, {
	fileListing: observable,
	fileListingLoaded: observable,
	reloadFileListingPending: observable,
	directory: observable,
	getFileListing: action,
	replaceFilesList: action,
	clearFilesList: action,
	setFilesLoaded: action,
	setReloadFilesPending: action,
	setDirectory: action,
	addFile: action,
	removeFile: action,
	sortedFileList: computed,
	filesCount: computed,
	currentDirectory: computed,
	pathArray: computed,
	openDirectory: action,
})
