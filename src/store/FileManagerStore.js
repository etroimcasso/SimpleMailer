import { decorate, observable, action, computed } from "mobx"
import openSocket from 'socket.io-client';
const hostname = require('../config/hostname.js');
const socket = openSocket(hostname.opensocket);
const UIStrings = require('../config/UIStrings')

//Needs to store an array of the file contents of the mailerContent directory.
//Should respond to events 'mailerContentFileAdded' and 'mailerContentFileRemoved' to change contents of list
//Should filter out testContent.txt
//Should contain state of loading like Subscribers and MailerHistory do
//Loading state is set to completed when file contents are 0 (including testContent.txt being filtered out)
//Loading state is set to completed when receives event 'getMailerContentsListingResults' 
//Should compute an array that contains arrays of files organized into types using filters 



//EVERY PRESS OF BACK BUTTON REMOVES ONE SECTION OF LIST and adds that full path to history array
//EVERY PRESS OF FORWARD BUTTON removes most recent history array item and changes directory to that full path

const sortAlphabetically = (a, b) => {
	const aName = a.name.toLowerCase()
	const bName = b.name.toLowerCase()
	return (aName > bName) ? 1 : (bName > aName) ? -1 : 0
}		

const determineErrorMessage = (error, filename) => {
	switch (error.code) {
		case 'EEXIST':
			return UIStrings.FileManager.FSErrorMessages.FileExists(filename)
		case 'ENAMETOOLONG':
			return UIStrings.FileManager.FSErrorMessages.NameTooLong(filename)
		default:
			return error.code
	}
} 
const maximumFileNameLength = 100

class FileManagerStore {
	fileListing = [] //Is filtered, use fileListingStorage to consistently get ALL files for current directory
	fileListingStorage = [] //Retains the unfiltered file listing, to be called upon when needed
	fileListingLoaded = false
	reloadFileListingPending = true
	directory = observable.box('/')
	flattenedGroups = true
	replaceFilesListPending = true
	sortTypes = ['ABC']
	directoriesFirst = true
	contextMenu = observable.box('')
	allFilterTypes = [] //Retrieved from the server at start
	currentFilterTypes = []
	errorMessage = observable.box('')
	infoWindows = []


	constructor() {
		socket.on('connect', () => {
			if(this.reloadFileListingPending) this.getFileListing()
		})

		socket.on('disconnect', () => {
			this.setReloadFilesPending(true)
		})

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
					//The below is done so that the files list isn't replaced until the filters list is loaded.
					//This is done because otherwise, the currentFilterTypes list will be empty when the interface loads, showing no files.
					if (this.allFilterTypes.length === 0) this.getAllFilterTypes(() => this.replaceFilesList(files))
					else this.replaceFilesList(files)
					this.setReplaceFilesListPending(false)
					this.fileListingStorage = files
					//console.log(files)
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

	replaceFilesList = (newList) => this.fileListing = this.sortFiles(this.filterFiles(newList))
	
	clearFilesList = () => this.fileListing = this.fileListing.filter((item) => null)

	addFile = (file) => this.fileListing = this.fileListing.concat(file)

	removeFile = (file) => this.fileListing = this.fileListing.filter((item) => item.name !== file.name)

	dispatchCreateNewDirectorySocketMessage = (directoryName, callback) => {
		socket.on('createNewDirectoryResults', error => callback(error))
		socket.emit('createNewDirectory', this.currentDirectory, directoryName)

	}

	createNewDirectory = (directoryName) => {
		if (directoryName.length < maximumFileNameLength) {		
			this.dispatchCreateNewDirectorySocketMessage(directoryName, (error) => {
				if (!error) {
					this.setReplaceFilesListPending(true)
					this.getFileListing()
				} else {
					this.setErrorMessage(determineErrorMessage(error, directoryName))
				}
			})
		} else this.setErrorMessage(UIStrings.FileManager.FSErrorMessages.NameTooLong)
	}

	dispatchRenameFileSocketMessage = (oldFileWithPath, newFileWithPath, callback) => {
		socket.on('renameFileResults', error => callback(error))
		socket.emit('renameFile', oldFileWithPath, newFileWithPath)
	}

	renameItem = (filePath, oldName, newName) => {
		this.dispatchRenameFileSocketMessage(`${filePath}${oldName}`,`${filePath}${newName}`, (error) => {
			if (!error) {
				this.setReplaceFilesListPending(true)
				this.getFileListing()
			} else {
				this.setErrorMessage(determineErrorMessage(error, newName))
			}
		})

	}

	setFilesLoaded = (loaded) => this.fileListingLoaded = loaded

	setReloadFilesPending = (pending) => this.reloadFileListingPending = pending

	toggleDirectoriesFirst = () => {
		this.directoriesFirst = !this.directoriesFirst
		//Update file listing
		this.resetFilesFromStorage()
		//this.replaceFilesList(this.fileListing)
	}


	//Get all filter types using a socket mssage
	//is also used to reset filter types back to all 
	//Uses a callback instead of returning a value to better control UI flow
	getAllFilterTypes = (callback) => {
		socket.on('getAllFilterTypesResults', (results) => { 
			this.replaceAllFilterTypes(results)
			this.changeCurrentFilterTypes(results)
			callback()
		})
		socket.emit('getAllFilterTypes')

	}


	//Get filter types by inspecting each file
	//Using a reduce, add each { typeName: typeName, type: type } to the accumulator if its 
	//  type value cannot be found in the accumulator array
	//SORTS ALPHABETICALLY
	//getAllFilterTypes = (files) => files.reduce((acc, cv, index, array) => (acc.find(element => element.type === cv.type) === undefined) ? acc.concat({ type: cv.type, name: cv.typeName}) : acc, []).sort(sortAlphabetically)

	replaceAllFilterTypes = (filterTypes) => this.allFilterTypes = filterTypes.sort(sortAlphabetically)

	changeCurrentFilterTypes = (filterTypes) => this.currentFilterTypes = filterTypes

	resetFilesFromStorage = () => {
		this.replaceFilesList(this.fileListingStorage)
	}

	resetCurrentFilterTypes = () => {
		this.currentFilterTypes = this.allFilterTypes
		this.replaceFilesList(this.fileListingStorage)
	}

	filterOutAll = () => {
		this.currentFilterTypes = []
		this.replaceFilesList(this.fileListing)

	}

	addCurrentFilterType = (filterType) => {
		//Concat the new filterType to the array if it cannot be found in the array
		if (!this.currentFilterTypes.find(item => item.type === filterType.type)) 
				this.changeCurrentFilterTypes(this.currentFilterTypes.concat(filterType).sort(sortAlphabetically))
		//Get new file listing
		this.setReplaceFilesListPending(true)
		this.resetFilesFromStorage()
	}


	removeCurrentFilterType (filterType) {
		//Filter out the item that matches filterType
		this.changeCurrentFilterTypes(this.currentFilterTypes.filter((item) => item.name != filterType.name ).sort(sortAlphabetically))
		//Update file listing
		this.replaceFilesList(this.fileListing)
	}

	//Create an array for each filterType (file.type === filterType)
	//Combine these arrays into a single object array and return it
	filterFiles = (files) => this.currentFilterTypes.reduce((filterFiles, filterType) => 
				filterFiles.concat(files.filter(item => 
					item.type === filterType.type)), [])

	

	sortFiles = (files) => {
		//Apply a reduction to the sortType list
		//For each sortType, apply the sort then return the value to the accumlator
		//The resulting array should be sorted with the filter types

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
		this.resetFilesFromStorage()
		//this.replaceFilesList(this.fileListing)
	}

	resetErrorMessage = () => {
		this.setErrorMessage('')
	}

	setErrorMessage = (message) => {
		this.errorMessage.set(`${message}`)
	}

	get currentErrorMessage() {	return this.errorMessage.get() }

	openInfoWindow = (file) => (this.infoWindows.find(item => item.name === file.name && item.localPath === file.localPath ) === undefined) ? this.infoWindows = this.infoWindows.concat(file) : null
	closeInfoWindow = (file) => this.infoWindows = this.infoWindows.filter(item => item !== file )
	closeAllInfoWindows = () => this.infoWindows = []

}

export default decorate(FileManagerStore, {
	fileListing: observable,
	fileListingLoaded: observable,
	reloadFileListingPending: observable,
	directory: observable,
	directoriesFirst: observable,
	sortTypes: observable,
	contextMenu: observable,
	directoriesFirst: observable,
	allFilterTypes: observable,
	currentFilterTypes: observable,
	errorMessage: observable,
	infoWindows: observable,
	getFileListing: action,
	getAllFilterTypes: action,
	replaceFilesList: action,
	createNewDirectory: action,
	resetFilesFromStorage: action,
	filterOutAll: action,
	resetCurrentFilterTypes: action,
	changeCurrentFilterTypes: action,
	replaceAllFilterTypes: action,
	replaceWithSortedFilesList: action,
	clearFilesList: action,
	setFilesLoaded: action,
	setReloadFilesPending: action,
	toggleDirectoriesFirst: action,
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
	addCurrentFilterType: action,
	removeCurrentFilterType: action,
	currentErrorMessage: computed,
	setErrorMessage: action,
	resetErrorMessage: action,
	openInfoWindow: action,
	closeInfoWindow: action,
	closeAllInfoWindows: action
})
