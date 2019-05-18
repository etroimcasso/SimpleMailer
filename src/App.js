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
import MailerContentStore from './store/MailerContentStore'
import AppStateStore from './store/AppStateStore'
import ConnectionStateStore from './store/ConnectionStateStore'
import SubscriberStore from './store/SubscriberStore'
const ConnectionState = new ConnectionStateStore()
const MailerContentState = new MailerContentStore()
const AppState = new AppStateStore()
const SubscriberState = new SubscriberStore()

const hostname = require('./config/hostname.js');
const socket = openSocket(hostname.opensocket);
const UIStrings = require('./config/UIStrings');
const ReconnectionTimer = require('./helpers/ReconnectionTimer');



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

 
	render() {
    
    const protectedRoutes = {
      root: "/",
      history: "/history",
      subscriptions:  "/subscriptions",
      fileManager: "/files"
    }

    

  	return (
      <Provider mailerContentState={MailerContentState} appState={AppState} connectionState={ConnectionState} subscriberState={SubscriberState}>
        <BrowserRouter>
  			   <div className="App">
              <Route exact path={[protectedRoutes.root, protectedRoutes.history, protectedRoutes.subscriptions, protectedRoutes.fileManager]} component={TopBar} />
  				    <Container style={{height: '100%'}}>
                <Route exact path={protectedRoutes.root} component={MailerEditor} />
                <Route exact path={protectedRoutes.history} component={MailerHistory} />
  				      <Route exact path={protectedRoutes.subscriptions} component={SubscriptionsPanel} />
                <Route exact path={protectedRoutes.fileManager} component={FileManager} />
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




const redirectAwayFromMailer = () => {
  return(
    <Redirect to='/subscribeResults' />
  )
}
