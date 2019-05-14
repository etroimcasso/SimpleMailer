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
const AppState = new AppStateStore()


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
    subscribersList: [],
    mailerResults: [],
    mailerHistory: [],
    mailerHistoryResults: [],
  }

  componentWillMount() {
    this.getAllSubscribers()
    this.getAllMailers()
    this.getAllMailerResults()

    document.title = UIStrings.AppTitle
  }

  componentDidMount() {
    socket.on('connect', () => {
      if (AppState.reloadSubscribersPending) {
        this.setState({
          subscribersList: [],
        })
        this.getAllSubscribers()
      }
      if (AppState.reloadMailerHistoryPending) {
        this.setState({
          mailerHistory: [],
        })
        this.getAllMailers()
      }
      if (AppState.reloadMailerHistoryResultsPending) {
        this.setState({
          mailerHistoryResults: [],
        })
        this.getAllMailerResults()
      }
    })


    socket.on('mailerSendToSubscriberResult', (error, email) => {
      this.setState({
        mailerResults: this.state.mailerResults.concat({
          email: email,
          error: error
        }),
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
      //console.log(`REMOVE ${email}`)
      this.setState({
        subscribersList: this.state.subscribersList.filter( (item) => {
          return item.email !== email
        })
      })
    })


    socket.on('mailerAddedToHistory', mailer => {
      //console.log("ADDED TO HISTORY")
      this.setState({
        mailerHistory: this.state.mailerHistory.concat(JSON.parse(mailer))
      })
      this.getAllMailerResults() // This isn't needed if MailerHistory requests each item from the server when it's needed
    })
    
  }

  getAllSubscribers = () => {
    //Start timer
    //When timer ends getAllSubscribers' again if subscribersLoaded is  false
    
    ReconnectionTimer(3000, () => {
      if (!AppState.subscribersLoaded) this.getAllSubscribers()
    })
    
    getAllSubscribers((error, subscribers) => {
      if (!error) {
        this.setState({
          subscribersList: JSON.parse(subscribers),
          //subscribersLoaded: true
        })
        AppState.setSubscribersLoaded(true)
      }
    })
  }

  getAllMailers = () => {
    ReconnectionTimer(3000,() => { 
      if (!AppState.mailerHistoryLoaded) 
        this.getAllMailers() 
    })

    getAllMailers((error, mailers) => {
      if (!error) {        
        AppState.setMailerHistoryLoaded(true)
        this.setState({
          mailerHistory: JSON.parse(mailers),
          //mailerHistoryLoaded: true
        })

      }
    })
  }

  getAllMailerResults = () => {
    ReconnectionTimer(3000,() => { 
      if (!AppState.mailerHistoryLoaded) 
        this.getAllMailerResults() 
    })

    getAllMailerResults((error, mailerHistoryResults) => {
      //console.log(`MAILER HISTORY: ${mailerHistoryResults}`)        
      AppState.setMailerHistoryResultsLoaded(true)
      if (!error) {
        this.setState({
          mailerHistoryResults: JSON.parse(mailerHistoryResults),
          //mailerHistoryResultsLoaded: true
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
      //mailerBeingSent: true,
      mailerResults: [],
      //mailerProgressModalOpen: true
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

  handleSubscriberDeleteButtonClick = (subscriberObject) => {

    //console.log("Subscriber DELETE button click")
    //console.log(subscriberObject)
    removeSubscriber(subscriberObject, (error, subscriber) => {
      // Don't need to do anything here since the subscriber list updates automatically whenever a subscriber is added or removed
    })
  }

  handleAddSubscriberButtonClick = (email) => {
    addSubscriber(email)
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
      subscribersList,
      mailerResults,
      mailerHistory,
      mailerHistoryResults,
    } = this.state

    //const { connection } = this.props
    const {   
      subscriberInfoMessage,
      subscriberError,
      mailerBeingSent,
      subscribersLoaded,
      mailerProgressModalOpen,
      reloadSubscribersPending,
      mailerHistoryLoaded,
      reloadMailerHistoryPending,
      mailerHistoryResultsLoaded,
      reloadMailerHistoryResultsPending,
    } = AppState

    const renderProps = {
      connection: {
        connection: false,
      },
      mailerEditor: {
        mailerBeingSent: mailerBeingSent,
        subscribersLoaded: subscribersLoaded,
        subscribersList: subscribersList,
        reloadSubscribersPending: reloadSubscribersPending,
        mailerResults: mailerResults,
        mailerProgressModalOpen: mailerProgressModalOpen,
        handleModalClose: this.closeModalAndConfirmMailerSend,
        handleSendButtonClick: this.handleSendButtonClick,
      },
      mailerHistory: {
        mailerHistory: mailerHistory,
        mailerHistoryLoaded: mailerHistoryLoaded,
        mailerHistoryResults: mailerHistoryResults,
        mailerHistoryResultsLoaded: mailerHistoryResultsLoaded,
        reloadMailerHistoryPending: reloadMailerHistoryPending,
      },
      SubscriptionsPanel: {
        subscribersList: subscribersList,
        subscribersLoaded: subscribersLoaded,
        handleSubscriberDeleteButtonClick: this.handleSubscriberDeleteButtonClick,
        onSubscriberAddClick: this.handleAddSubscriberButtonClick
      },
      TopBar: {
        mailerHistoryCount: mailerHistory.length,
        historyLoaded: mailerHistoryLoaded,
        subscriberCount: subscribersList.length,
        subscribersLoaded: subscribersLoaded
      }
    }


    const  protectedRoutes = {
      root: "/",
      history: "/history",
      subscriptions:  "/subscriptions"
    }

    

  	return (
      <BrowserRouter>
  			 <div className="App">
            <Route exact path={[protectedRoutes.root, protectedRoutes.history, protectedRoutes.subscriptions]} render={props => <TopBar {...props} {...Object.assign(renderProps.TopBar)} /> } />
  				  <Container style={{height: '100%'}}>
              <Route exact path={protectedRoutes.root} render={props => <MailerEditor {...props} {...Object.assign(renderProps.mailerEditor)}/>} />
              <Route exact path={protectedRoutes.history} render={props => <MailerHistory {...props} {...Object.assign(renderProps.mailerHistory)} />} />
  				    <Route exact path={protectedRoutes.subscriptions} render={props => <SubscriptionsPanel {...props} {...Object.assign(renderProps.SubscriptionsPanel, renderProps.connection)} />} />
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
