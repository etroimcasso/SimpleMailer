import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import './App.css';
import 'semantic-ui-css/semantic.min.css'; 
import openSocket from 'socket.io-client';
import MailerEditor from './components/MailerEditor';
import MailerHistory from './components/MailerHistory/MailerHistory'
import SubscriptionsPanel from './components/SubscriptionsPanel/SubscriptionsPanel'
import TopBar from './components/TopBar'
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { BrowserRouter } from 'react-router-dom';
import { observer } from "mobx-react"
import AppStateStore from './store/AppStateStore'
import SubscriberStore from './store/SubscriberStore'
import MailerHistoryStore from './store/MailerHistoryStore'
const AppState = new AppStateStore()
const SubscribersState = new SubscriberStore()
const MailerHistoryState = new MailerHistoryStore()


const hostname = require('./config/hostname.js');
const socket = openSocket(hostname.opensocket);
const UIStrings = require('./config/UIStrings');
const ReconnectionTimer = require('./helpers/ReconnectionTimer');


const convertRawEditorContentToHTML = (rawContent) => draftToHtml(rawContent)


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

//Subscriber is an object of email: and id:
const removeSubscriber = (subscriber, callback) => {
  socket.on('subscriberRemoved', (error, subscriber) => callback(error, subscriber))
  socket.emit('removeSubscriber', subscriber.email, subscriber.id)
}

const addSubscriber = (email) => {
    //socket.on('subscriberAdded', (error, subscriber) => callback(error, subscriber))
    socket.emit('addSubscriber', email)
} 


export default observer(class App extends Component {
  state = {
    mailerResults: [],
    mailerHistoryResults: [],
  }

  componentWillMount() {
    //SubscribersState.getAllSubscribers()
    //MailerHistoryState.getAllMailers()
    //this.getAllMailerResults()
    document.title = UIStrings.AppTitle
  }

  componentDidMount() {

    socket.on('mailerSendToSubscriberResult', (error, email) => {
      this.setState({
        mailerResults: this.state.mailerResults.concat({
          email: email,
          error: error
        }),
      })
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
    addSubscriber(email)
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
    removeSubscriber({email: email, id: match.params.id}, (error, subscriber) => {})


    
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

    AppState.setMailerBeingSent(true)
    AppState.setMailerProgressModalOpen(true)
    this.setState({ 
      mailerResults: [],
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
    
    sendMailer(message, (error, subscriberEmail) => {})
  }

 

  closeModalAndConfirmMailerSend = () => {
    AppState.setMailerProgressModalOpen(false)
    this.setState({
      //mailerProgressModalOpen: false,
      mailerResults: [],
    })
  }

	render() {
    const { 
      mailerResults,
    } = this.state

    const {   
      subscriberInfoMessage,
      mailerBeingSent,
      mailerProgressModalOpen,
     
    } = AppState

    const { 
      subscribers: subscribersList,   
      subscribersLoaded,
      subscriberError,
      reloadSubscribersPending,
    } = SubscribersState

    const {
      mailerHistory,
      mailerHistoryLoaded,
      reloadMailerHistoryPending,
      mailerHistoryResultsLoaded,
      reloadMailerHistoryResultsPending,
    } = MailerHistoryState

    const renderProps = {
      mailerEditor: {
        mailerBeingSent: mailerBeingSent,
        mailerResults: mailerResults,
        handleModalClose: this.closeModalAndConfirmMailerSend,
        handleSendButtonClick: this.handleSendButtonClick,
      },
    }


    const  protectedRoutes = {
      root: "/",
      history: "/history",
      subscriptions:  "/subscriptions"
    }

    

  	return (
      <BrowserRouter>
  			 <div className="App">
            <Route exact path={[protectedRoutes.root, protectedRoutes.history, protectedRoutes.subscriptions]} component={TopBar} />
  				  <Container style={{height: '100%'}}>
              <Route exact path={protectedRoutes.root} render={props => <MailerEditor {...props} {...renderProps.mailerEditor}/>} />
              <Route exact path={protectedRoutes.history} component={MailerHistory} />
  				    <Route exact path={protectedRoutes.subscriptions} component={SubscriptionsPanel} />
              <Route path="/subscribe/:email" component={this.AddSubscriberBridge} />
              <Route path="/unsubscribe/:email/:id" component={this.RemoveSubscriberBridge} />
              <Route path="/subscribeResults" component={this.subscriptionChangeResults} />
            </Container>
    		  </div>
        </BrowserRouter>
  		)
  }
})




const redirectAwayFromMailer = () => {
  return(
    <Redirect to='/subscribeResults' />
  )
}
