import React, { Component } from 'react';
import { Route, Redirect, BrowserRouter } from 'react-router-dom';
import { Provider } from "mobx-react"
import { Container } from 'semantic-ui-react';
import './App.css';
import 'semantic-ui-css/semantic.min.css'; 
import { observer } from "mobx-react"
import openSocket from 'socket.io-client';
import MailerEditor from './components/MailerEditor';
import MailerHistory from './components/MailerHistory/MailerHistory'
import SubscriptionsPanel from './components/SubscriptionsPanel/SubscriptionsPanel'
import TopBar from './components/TopBar'
import FileManager from './components/FileManager'
import LoginPage from './components/LoginPage'
import FileManagerStore from './store/FileManagerStore'
import AppStateStore from './store/AppStateStore'
import MailerHistoryStore from './store/MailerHistoryStore'
import ConnectionStateStore from './store/ConnectionStateStore'
import SubscriberStore from './store/SubscriberStore'
const ConnectionState = new ConnectionStateStore()
const FileManagerState = new FileManagerStore()
const AppState = new AppStateStore()
const SubscriberState = new SubscriberStore()
const MailerHistoryState = new MailerHistoryStore()
const hostname = require('./config/hostname.js');
const socket = openSocket(hostname.opensocket);
const UIStrings = require('./config/UIStrings');
const ReconnectionTimer = require('./helpers/ReconnectionTimer');
const Routes = require('./config/Routes')



//Subscriber is an object of email: and id:
const removeSubscriber = (subscriber, callback) => {
  socket.on('subscriberRemoved', (error, subscriber) => callback(error, subscriber))
  socket.emit('removeSubscriber', subscriber.email, subscriber.id)
}

const addSubscriber = (email) => {
    socket.emit('addSubscriber', email)
} 

export default observer(class App extends Component {

  componentWillMount() {
    document.title = UIStrings.AppTitle
  }

  componentDidMount() {
    
  }


  AddSubscriberBridge = ({ match }) => {
    const email = match.params.email

    socket.on('subscriberAdded', error => {
        if (!error) {
          return (
            <SubscriptionConfirmation email={email} />
          )
        } else return null
    })
    addSubscriber(email)
    
    return redirectAwayFromMailer()
  } 

  RemoveSubscriberBridge = ({match}) => {
    const email = match.params.email
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

 
	render() {

    const protectedRoutes = Object.keys(Routes.ProtectedRoutes).map(item => Routes.ProtectedRoutes[item])
  
  	return (
      <Provider fileManagerState={FileManagerState} 
      appState={AppState} 
      connectionState={ConnectionState} 
      subscriberState={SubscriberState}
      mailerHistoryState={MailerHistoryState}
      >
        <BrowserRouter>
  			   <div className="App">
              <Route exact path={protectedRoutes} component={TopBar} />
  				    <Container style={{height: '100%'}}>
                <Route exact path={Routes.ProtectedRoutes.Root} component={MailerEditor} />
                <Route exact path={Routes.ProtectedRoutes.History} component={MailerHistory} />
  				      <Route exact path={Routes.ProtectedRoutes.Subscriptions} component={SubscriptionsPanel} />
                <Route exact path={Routes.ProtectedRoutes.FileManager} component={FileManager} />
                <Route exact path={Routes.Login} component={LoginPage} />
                <Route path="/subscribe/:email" component={this.AddSubscriberBridge} />
                <Route path="/unsubscribe/:email/:id" component={this.RemoveSubscriberBridge} />
                <Route path="/subscribeResults" component={this.subscriptionChangeResults} />
              </Container>
    		    </div>
          </BrowserRouter>
        </Provider>
  		)
  }
})

const SubscriptionConfirmation = (props) => (
    <div>{props.email} has been added</div>
)



const redirectAwayFromMailer = () => {
  return(
    <Redirect to='/subscribeResults' />
  )
}

