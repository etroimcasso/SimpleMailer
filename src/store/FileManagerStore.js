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



//EVERY PRESS OF BACK BUTTON REMOVES ONE SECTION OF LIST and adds that full path to history array
//EVERY PRESS OF FORWARD BUTTON removes most recent history array item and changes directory to that full path

class FileManagerStore {
	fileListing = []
	fileListingLoaded = false
	reloadFileListingPending = true
	directory = observable.box('/')
	flattenedGroups = true
	replaceFilesListPending = true
	sortTypes = ['ABC']
	directoriesFirst = true
	contextMenu = observable.box('')


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
					this.setReplaceFilesListPending(false)
					this.resetContextMenu()
				}
			}
			this.setFilesLoaded(true)
			this.setReloadFilesPending(false)
		})
	}

	resetContextMenu = () => this.contextMenu.set('')

	setContextMenu = (filename) => this.contextMenu.set(filename)

	setReplaceFilesListPending = (pending) => this.replaceFilesListPending = pending

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


		const sortAlphabetically = (a, b) => {
			const aName = a.name.toLowerCase()
			const bName = b.name.toLowerCase()
			return (aName > bName) ? 1 : (bName > aName) ? -1 : 0
		}		
		const sortAlphabeticallyReverse = (a, b) => {
			const aName = a.name.toLowerCase()
			const bName = b.name.toLowerCase()
			return (aName > bName) ? -1 : (bName > aName) ? 1 : 0
		}
		const sortLargestFirst = (a, b) => {
			const aSize = a.sizeInBytes
			const bSize = b.sizeInBytes
			return (aSize > bSize) ? -1 : (bSize > aSize) ? 1 : 0
		}
		const sortSmallestFirst = (a, b) => {
			const aSize = a.sizeInBytes
			const bSize = b.sizeInBytes
			return (aSize > bSize) ? 1 : (bSize > aSize) ? -1 : 0
		}
		const sortOldestFirst = (a, b) => {
			const aCreated = a.created
			const bCreated = b.created
			return (aCreated > bCreated) ? 1 : (bCreated > aCreated) ? -1 : 0
		}
		const sortNewestFirst = (a, b) => {
			const aCreated = a.created
			const bCreated = b.created
			return (aCreated > bCreated) ? -1 : (bCreated > aCreated) ? 1 : 0
		}
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
					default: return item => item
			}
		}

		const sortListReduceFunc = (sortedList, sortType) => sortedList.sort(thisSort(sortType))

		const preProcessedSort = this.sortTypes.reduce(sortListReduceFunc, files)
		const onlyDirectoryFiles = (this.directoriesFirst) ? preProcessedSort.filter(onlyDirectories) : []
		const sortedFiles = (this.directoriesFirst && onlyDirectoryFiles.length > 1) 
			? this.sortTypes.reduce(sortListReduceFunc, onlyDirectoryFiles).concat(preProcessedSort.filter(noDirectories))
			: preProcessedSort

		return sortedFiles
	}

	setDirectory = (dir) => {
		this.setReloadFilesPending(true)
		this.setReplaceFilesListPending(true)
		this.directory.set(dir)
	}

	resetDirectory = () => {
		this.setReloadFilesPending(true)
		this.setReplaceFilesListPending(true)
		this.directory.set("/")
	}

	get filesCount() { return this.fileListing.length }

	get currentDirectory() { return this.directory.get() }

	get pathArray() { return this.directory.get().split('/').filter(item => item !== "") }

	get contextMenuName() { return this.contextMenu.get()}


	openDirectory(filename) {
		this.setReloadFilesPending(true)
		const currentDirectory = this.directory.get()
		const newDirectory = (currentDirectory === '/') ? `/${filename}/` :`${currentDirectory}${filename}/`
		this.setDirectory(newDirectory)
	}

	openParentDirectory = () => {
		this.setReloadFilesPending(true)
		const reduceFunc = (accumulator, currentValue, index, array) => (index >= array.length - 1) ? accumulator : `${accumulator}${currentValue}/`
		const newDirectory = this.pathArray.reduce(reduceFunc, '/')
		this.setDirectory(newDirectory)
	}

	setSortType = (newSortType) => {
		this.sortTypes = [newSortType]
		this.replaceFilesList(this.fileListing)
	}


}

export default decorate(FileManagerStore, {
	fileListing: observable,
	fileListingLoaded: observable,
	reloadFileListingPending: observable,
	directory: observable,
	directoriesFirst: observable,
	sortTypes: observable,
	contextMenu: observable,
	getFileListing: action,
	replaceFilesList: action,
	replaceWithSortedFilesList: action,
	clearFilesList: action,
	setFilesLoaded: action,
	setReloadFilesPending: action,
	setDirectory: action,
	resetDirectory: action,
	setContextMenu: action,
	resetContextMenu: action,
	addFile: action,
	removeFile: action,
	filesCount: computed,
	currentDirectory: computed,
	contextMenuName: computed,
	pathArray: computed,
	openDirectory: action,
	setReplaceFilesListPending: action,
	setSortType: action,
})
