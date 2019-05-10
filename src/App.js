import React, { Component } from 'react';
import { Route, Redirect, Link } from 'react-router-dom';
import './App.css';
import 'semantic-ui-css/semantic.min.css'; 
import openSocket from 'socket.io-client';
import MailerEditor from './components/MailerEditor';
import ConnectionWrapper from './components/ConnectionWrapper'
import MailerHistory from './components/MailerHistory/MailerHistory'
import TopBar from './components/TopBar'
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';



const hostname = require('./config/hostname.js');
const socket = openSocket(hostname.opensocket);
const UIStrings = require('./config/UIStrings');
const ReconnectionTimer = require('./helpers/ReconnectionTimer');

const convertRawEditorContentToHTML = (rawContent) => draftToHtml(rawContent)


//Loads the subscribersList state with data
const getAllSubscribers = (callback) => {
  socket.on('getAllSubscribersResult', (error, subscribers) => callback(error, subscribers))
  socket.emit('getAllSubscribers')
}

const sendMailer = (message) => {
  socket.emit('sendMailer', message)
} 

const getAllMailers = (callback) => {
  socket.on('getAllMailersResults', (error, mailerResults) => callback(error, mailerResults))
  socket.emit('getAllMailers')
}

const getAllMailerResults = (callback) => {
  socket.on('getAllMailerResultsResults', (error, results) => callback(error, results))
  socket.emit('getAllMailerResults')
}


export default class App extends Component {
  state = {
    subscriberInfoModalOpen: false,
    subscriberInfoMessage: "",
    subscriberError: false,
    connection: false,
    mailerBeingSent: false,
    subscribersLoaded: false,
    subscribersList: [],
    reloadSubscribersPending: false,
    mailerResults: [],
    mailerProgressModalOpen: false,
    mailerHistory: [],
    mailerHistoryLoaded: false,
    reloadMailerHistoryPending: false,
    mailerHistoryResults: [],
    mailerHistoryResultsLoaded: false,
    reloadMailerHistoryResultsPending: false
  }

  componentWillMount() {
    this.getAllSubscribers()
    this.getAllMailers()
    this.getAllMailerResults()
  }

  componentDidMount() {
    socket.on('connect', () => {
      if (this.state.reloadSubscribersPending) {
        this.setState({
          subscribersList: [],
          subscribersLoaded: false
        })
        this.getAllSubscribers()
      }
      if (this.state.reloadMailerHistoryPending) {
        this.setState({
          mailerHistory: [],
          mailerHistoryLoaded: false
        })
        this.getAllMailers()
      }
      if (this.state.reloadMailerHistoryResultsPending) {
        this.setState({
          mailerHistoryResults: [],
          mailerHistoryResultsLoaded: false
        })
        this.getAllMailerResults()
      }
      this.setState({
        connection: true,
        reloadSubscribersPending: false,
        reloadMailerHistoryPending: false
      })
    })

    socket.on('disconnect', () => {
      this.setState({
        connection: false,
        reloadSubscribersPending: true,
        reloadMailerHistoryPending: true,
        reloadMailerHistoryResultsPending: true
      })
    })

    socket.on('mailerSendToSubscriberResult', (error, email) => {
      this.setState({
        mailerResults: this.state.mailerResults.concat({
          email: email,
          error: error
        }),
      })
    })

    socket.on('sendMailerFinished', () => {
      this.setState({ 
        mailerBeingSent: false,
        //allMailSent: true,
      })

    })

    //Adds the new subscriber to the list
    socket.on('newSubscriberAdded', (subscriber) => {
      subscriber = JSON.parse(subscriber)
      this.setState({
        subscribersList: this.state.subscribersList.concat(subscriber)
      })
    })

    //Removes subscriber from list
    socket.on('subscriberUnsubscribed', (email) =>{
      console.log(`REMOVE ${email}`)
      this.setState({
        subscribersList: this.state.subscribersList.filter( (item) => {
          return item.email !== email
        })
      })
    })

    socket.on('noSubscribers', () => {
      this.setState({
        subscribersLoaded: true
      })
    })

    socket.on('noMailers', () => {
      this.setState({
        mailerHistoryLoaded: true
      })
    })

    socket.on('noMailerResultss', () => {
      this.setState({
        mailerHistoryResultsLoaded: true
      })
    })

    socket.on('mailerAddedToHistory', mailer => {
      console.log("ADDED TO HISTORY")
      this.setState({
        mailerHistory: this.state.mailerHistory.concat(JSON.parse(mailer))
      })
    })
    
  }

  getAllSubscribers = () => {
    //Start timer
    //When timer ends getAllSubscribers' again if subscribersLoaded is  false
    
    ReconnectionTimer(3000, () => {
      if (!this.state.subscribersLoaded) this.getAllSubscribers()
    })
    
    getAllSubscribers((error, subscribers) => {
      if (!error) {
        this.setState({
          subscribersList: JSON.parse(subscribers),
          subscribersLoaded: true
        })
      }
    })
  }

  getAllMailers = () => {
    ReconnectionTimer(3000,() => { 
      if (!this.state.mailerHistoryLoaded) 
        this.getAllMailers() 
    })

    getAllMailers((error, mailers) => {
      if (!error) {
        this.setState({
          mailerHistory: JSON.parse(mailers),
          mailerHistoryLoaded: true
        })
      }
    })
  }

  getAllMailerResults = () => {
    ReconnectionTimer(3000,() => { 
      if (!this.state.mailerHistoryLoaded) 
        this.getAllMailerResults() 
    })

    getAllMailerResults((error, mailerHistoryResults) => {
      //console.log(`MAILER HISTORY: ${mailerHistoryResults}`)
      if (!error) {
        this.setState({
          mailerHistoryResults: JSON.parse(mailerHistoryResults),
          mailerHistoryResultsLoaded: true
        })
      }
    })
  }


  AddSubscriberBridge = ({ match }) => {
    const email = match.params.email
    /*
      socket.on('subscriberAdded', (error) => {
        if (error) {
          this.setState({
            subscriberInfoMessage: UIStrings.SubscribeError(email)
          })
        }
        else {
          this.setState({
            subscriberInfoMessage: UIStrings.SubscribeSuccess(email)
          })
        }
    })
    */
    socket.emit('addSubscriber', email)
    return redirectAwayFromMailer()
  } 

  RemoveSubscriberBridge = ({match}) => {
    const email = match.params.email
    /*
    socket.on('subscriberRemoved', (error, subscriber) => {
      if (error) {
        this.setState({
          subscriberInfoMessage: UIStrings.UnsubscribeError(email)
        })
      } else {
        this.setState({
          subscriberInfoMessage: UIStrings.UnsubscribeSuccess(email)
        })
      } 
    })
    */
    socket.emit('removeSubscriber', email, match.params.id )
    return redirectAwayFromMailer()
  }

  
  subscriptionChangeResults = ({match}) => {

    /*
    switch (option) {
      case "subscribe":
        message = (error) ? UIStrings.SubscribeError(email): UIStrings.SubscribeSuccess(email)
        break;
      case "unsubscribe":
        message = (error) ? UIStrings.UnsubscribeError(email): UIStrings.UnsubscribeSuccess(email)
        break;
    }
    */

    return(
      <div>
        <span>{UIStrings.GenericSubscribeResult}</span>
      </div>
      )  
  }

  handleSendButtonClick = (editorState, subject) => {
    const currentContent = editorState.getCurrentContent()
    const rawContent = convertToRaw(currentContent)
    const plainText = currentContent.getPlainText() //Plain Text
    const htmlText = convertRawEditorContentToHTML(rawContent)

    this.setState({ 
      mailerBeingSent: true,
      mailerResults: [],
      mailerProgressModalOpen: true
    })

    const message = {
      senderEmail: null,
      senderName: null,
      receiverEmails: null,
      ccReceivers: null,
      bccReceivers: null,
      subject: subject,
      messageText: plainText,
      html: htmlText,
      attachments: null,
      replyTo: null

    }
    
    sendMailer(message, (error, subscriberEmail) => {

    })

  }
  closeModalAndConfirmMailerSend = () => {
    this.setState({
      mailerProgressModalOpen: false,
      mailerResults: [],
    })
  }

	render() {
    const { 
      connection,
      mailerBeingSent,
      subscribersLoaded,
      subscribersList,
      reloadSubscribersPending,
      mailerResults,
      mailerProgressModalOpen,
      mailerHistory,
      mailerHistoryLoaded,
      reloadMailerHistoryPending,
      mailerHistoryResults,
      mailerHistoryResultsLoaded,
    } = this.state

    const renderProps = {
      connection: {
        connection: connection,
      },
      mailerEditorProps: {
        mailerBeingSent: mailerBeingSent,
        subscribersLoaded: subscribersLoaded,
        subscribersList: subscribersList,
        reloadSubscribersPending: reloadSubscribersPending,
        mailerResults: mailerResults,
        mailerProgressModalOpen: mailerProgressModalOpen,
        handleModalClose: this.closeModalAndConfirmMailerSend,
        handleSendButtonClick: this.handleSendButtonClick,
      },
      mailerHistoryProps: {
        mailerHistory: mailerHistory,
        mailerHistoryLoaded: mailerHistoryLoaded,
        mailerHistoryResults: mailerHistoryResults,
        mailerHistoryResultsLoaded: mailerHistoryResultsLoaded,
        reloadMailerHistoryPending: reloadMailerHistoryPending,
      }
    }

    

  	return (
  			<div className="App">
          <TopBar connection={connection} mailerHistoryCount={mailerHistory.length}/>
  				<Route exact path="/" render={props => <MailerEditor {...props} {...Object.assign(renderProps.mailerEditorProps, renderProps.connection)}/>} />
          <Route exact path="/history" render={props => <MailerHistory {...props} {...Object.assign(renderProps.mailerHistoryProps, renderProps.connection)} />} />
  				<Route path="/subscribe/:email" component={this.AddSubscriberBridge} />
          <Route path="/unsubscribe/:email/:id" component={this.RemoveSubscriberBridge} />
          <Route path="/subscribeResults" component={this.subscriptionChangeResults} />
    		</div>
  		)
  }
}




const redirectAwayFromMailer = () => {
  return(
    <Redirect to='/subscribeResults' />
  )
}
