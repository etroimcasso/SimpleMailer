import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'semantic-ui-css/semantic.min.css'; 
import openSocket from 'socket.io-client';
import SimpleMailerController from './components/SimpleMailerController';
import TopBar from './components/TopBar';

const hostname = require('./config/hostname.js');
const socket = openSocket(hostname.opensocket);

export default class App extends Component {
	state = {
		connection: false
	}

	componentDidMount = () => {
		socket.on('connect', () => {
			this.setState({
				connection: true
			})
		})

		socket.on('disconnect', () => {
			this.setState({
				connection: false
			})
		})
	}
	render() {
		const { connection } = this.state

  		return (
  			<div className="App">
  				<TopBar connection={connection} />
      			<SimpleMailerController connection={connection}/>
    		</div>
  		)
  	}
}


