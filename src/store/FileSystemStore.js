import { decorate, observable, action, computed } from "mobx"
import openSocket from 'socket.io-client';
const hostname = require('../config/hostname.js');
const socket = openSocket(hostname.opensocket);

//Needs to store an array of the file contents of the mailerContent directory.
//Should respond to events 'mailerContentFileAdded' and 'mailerContentFileRemoved' to change contents of list
//Should filter out testContent.txt
//Should contain state of loading like Subscribers and MailerHistory do
//Loading state is set to completed when file contents are 0 (including testContent.txt being filtered out)
//Loading state is set to completed when receives event 'getMailerContentsListingResults' 
//Should compute an array that contains arrays of files organized into types using filters 


class FileSystemStore {
	fileListing = []
	fileListingLoaded = false
	reloadFileListingPending = true
	directory = observable.box("/")
	grouped = true
	replaceFilesListPending = true


	constructor() {
		socket.on('connect', () => {
			if(this.reloadFileListingPending) this.getFileListing()
		})

		socket.on('disconnect', () => {
			this.setReloadFilesPending(true)
		})

		socket.on('fileAdded', (file) => this.addFile(file))
		socket.on('fileRemoved', (file) => this.removeFile(file))

		this.directory.observe((change) => {
			this.getFileListing()
		})

	}

	dispatchGetFileListingSocketMessage(fileDir, callback) {
		socket.on('getFileListingResults', (error, files) => callback(error, files))
		socket.emit('getFileListing', fileDir, this.grouped)
	}

	getFileListing() {
		this.dispatchGetFileListingSocketMessage(this.directory.get(), (error, files) => {
			if (!error) {
				if (this.replaceFilesListPending === true) {
					this.replaceFilesList(files)
					this.setFilesListReplacePending(false)
				}
			}
			this.setFilesLoaded(true)
			this.setReloadFilesPending(false)
		})
	}

	setFilesListReplacePending = (pending) => this.replaceFilesListPending = pending

	replaceFilesList = (newList) => this.fileListing = newList
	
	clearFilesList = () => this.fileListing = this.fileListing.filter((item) => null)

	addFile = (file) => this.fileListing = this.fileListing.concat(file)

	removeFile = (file) => this.fileListing = this.fileListing.filter((item) => item.name !== file.name)

	setFilesLoaded = (loaded) => this.fileListingLoaded = loaded

	setReloadFilesPending = (pending) => this.reloadFileListingPending = pending

	setDirectory = (dir) => {
		this.setFilesListReplacePending(true)
		this.directory.set(dir)
	}

	resetDirectory = () => {
		this.setFilesListReplacePending(true)
		this.directory.set("/")
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
		const reduceFunc = (accumulator, currentValue, index, array) => (index >= array.length - 1) ? accumulator : `${accumulator}${currentValue}/`
		const newDirectory = this.pathArray.reduce(reduceFunc, '/')
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
	filesCount: computed,
	currentDirectory: computed,
	pathArray: computed,
	openDirectory: action,
	setFilesListReplacePending: action,
})
