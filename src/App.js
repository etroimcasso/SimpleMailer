import React, { Component } from 'react';
import { Route, Redirect, Link } from 'react-router-dom';
import './App.css';
import 'semantic-ui-css/semantic.min.css'; 
import openSocket from 'socket.io-client';
import MailerEditor from './components/MailerEditor';
import ConnectionWrapper from './components/ConnectionWrapper'
import MailerHistoryController from './components/MailerHistory/MailerHistoryController'
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
    mailerProgressModalOpen: false

  }

  componentWillMount() {
    this.getAllSubscribers()
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
      this.setState({
        connection: true,
        reloadSubscribersPending: false
      })
    })

    socket.on('disconnect', () => {
      this.setState({
        connection: false,
        reloadSubscribersPending: true
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
      mailerProgressModalOpen
    } = this.state

  const mailerEditorProps = {
    connection: this.state.connection,
        mailerBeingSent: this.state.mailerBeingSent,
        subscribersLoaded: this.state.subscribersLoaded,
        subscribersList: this.state.subscribersList,
        reloadSubscribersPending: this.state.reloadSubscribersPending,
        mailerResults: this.state.mailerResults,
        mailerProgressModalOpen: this.state.mailerProgressModalOpen,
        handleModalClose: this.closeModalAndConfirmMailerSend,
        handleSendButtonClick: this.handleSendButtonClick,
      }
    const mailerHistoryControllerProps = {
        test: "none"
      }

    

  	return (
  			<div className="App">
          <TopBar connection={connection} />
  				<Route exact path="/" render={props => <MailerEditor {...props} {...mailerEditorProps}/>} />
          <Route exact path="/history" render={props => <MailerHistoryController {...props} {...mailerHistoryControllerProps} />} />
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
