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


class FileManagerStore {
	fileListing = []
	fileListingLoaded = false
	reloadFileListingPending = true
	directory = observable.box('/')
	flattenedGroups = true
	replaceFilesListPending = true
	sortTypes = ['XYZ']
	directoriesFirst = true


	constructor() {
		socket.on('connect', () => {
			if(this.reloadFileListingPending) this.getFileListing()
		})

		socket.on('disconnect', () => {
			this.setReloadFilesPending(true)
		})

		//socket.on('fileAdded', (file) => this.addFile(file))
		//socket.on('fileRemoved', (file) => this.removeFile(file))

		this.directory.observe((change) => {
			this.getFileListing()
		})

		this.sortTypes.observe((change) => {
			this.replaceFilesList(this.fileListing)
		})

	}

	dispatchGetFileListingSocketMessage(fileDir, callback) {
		socket.on('getFileListingResults', (error, files) => callback(error, files))
		socket.emit('getFileListing', fileDir)
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

	replaceFilesList = (newList) => this.fileListing = this.sortFiles(newList)
	
	clearFilesList = () => this.fileListing = this.fileListing.filter((item) => null)

	addFile = (file) => this.fileListing = this.fileListing.concat(file)

	removeFile = (file) => this.fileListing = this.fileListing.filter((item) => item.name !== file.name)

	setFilesLoaded = (loaded) => this.fileListingLoaded = loaded

	setReloadFilesPending = (pending) => this.reloadFileListingPending = pending

	sortFiles = (files) => {
		//Apply a reduction to the sortType list
		//For each sortType, apply the sort then return the value to the accumlator
		//The resulting array should be sorted with the filter types

		const sortAlphabetically = (a, b) => a.name > b.name
		const sortAlphabeticallyReverse = (a, b) => a.name < b.name
		const sortLargestFirst = (a, b) => a.size < b.size
		const sortSmallestFirst = (a, b) => a.size > b.size
		const sortOldestFirst = (a, b) => a.created > b.created
		const sortNewestFirst = (a, b) => a.created > b.created
		const onlyDirectories = item => item.isDir
		const noDirectories = item => !item.isDir

		const thisSort = (sortType) => { 
				/*	ABC: Alphabetically, ZYX: Reverse Alphabetically, OLDEST: Oldest first, NEWEST: Newest first, LARGEST: largest file, SMALLEST: smallest */
				switch(sortType) {
					case 'ABC': return sortAlphabetically
					case 'ZYX': return sortAlphabeticallyReverse
					case 'LARGEST': return sortLargestFirst
					case 'SMALLEST': return sortSmallestFirst
					case 'OLDEST': return sortOldestFirst
					case 'NEWEST': return sortNewestFirst
			}
		}

		const preProcessedSort = this.sortTypes.reduce((sortedList, sortType) => sortedList.sort(thisSort(sortType)), files)
		const onlyDirectoryFiles = (this.directoriesFirst) ? preProcessedSort.filter(onlyDirectories) : []


		const sortedFiles = (this.directoriesFirst) 
			? onlyDirectoryFiles.reduce((sortedList, sortType) => sortedList.sort(thisSort(sortType)), onlyDirectoryFiles).concat(preProcessedSort.filter(noDirectories))
			: preProcessedSort

		return sortedFiles
	}

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

export default decorate(FileManagerStore, {
	fileListing: observable,
	fileListingLoaded: observable,
	reloadFileListingPending: observable,
	directory: observable,
	directoriesFirst: observable,
	sortTypes: observable,
	getFileListing: action,
	replaceFilesList: action,
	replaceWithSortedFilesList: action,
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
