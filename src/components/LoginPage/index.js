import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react'
import { Input, Button, Form, Divider, Label, Segment, Header } from 'semantic-ui-react';
import axios from 'axios';

const UIStrings = require('../../config/UIStrings')

const maxUsernameLength = 32

const styles = {
	flex: {
		display: 'flex',
	},
	flexColumn: {
		flexDirection: 'column'
	},
	centeredContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%',
		width: '100%'

	},
	halfWidth: {
		width: '100%'
	},
	formContainer: {
		position: 'absolute',
		top: '40vh',
		bottom: '50vh',
		width: '35%'
	}
}


export default inject('connectionState')(observer(class LoginPage extends Component {
	state = {
		username: '',
		password: '',
		login_error: false,
        createAccount_open: false
	}

	handleChange = (e, { name, value }) => {
	    this.setState({ 
	        [name]: value, 
	     });
	    this.setErrorState(false);
	}
	setErrorState = (errorState) => {
	    this.setState({ login_error: errorState })
	}

	handleSubmitClick = () => {
	    axios.post('/util/login',{
	        username: this.state.username,
	        password: this.state.password
	    }).then((response) => {
	        if (!response.data.error) {
	            this.props.history.push('/')
	        } else {
	            this.setErrorState(true);
	        }
	    }).catch((error) => {
	        this.setErrorState(true)
	    });
	}

	onCreateAccountClick = () => {}

	openCreateAccountModal = () => this.setState({ createAccount_open: true })
	closeCreateAccountModal = () => this.setState({ createAccount_open: false })

	render() {
		const { username, password, login_error, createAccount_open } = this.state;

		return(
			<div style={Object.assign(styles.flex, styles.centeredContainer, styles.flexColumn)}>
				<div style={styles.formContainer}>
				<Header as='h3'>{UIStrings.LoginPage.Header}</Header>
					<Segment>
					    <Form>
					        <Form.Field error={login_error}>
					            <label>{UIStrings.LoginPage.UsernameText}</label>
					            <Input name='username' 
					                placeholder={UIStrings.LoginPage.UsernameText}
					                value={username} 
					                onChange={this.handleChange} 
					                maxLength={maxUsernameLength}
					            />
					        </Form.Field>
					        <Form.Field error={login_error}>
					            <label>{UIStrings.LoginPage.PasswordText}</label>
					            <Input name="password" 
					                placeholder={UIStrings.LoginPage.PasswordText}
					                type='password' 
					                value={password} 
					                onChange={this.handleChange} 
					            />
					        </Form.Field>
					        <Form.Button fluid content={UIStrings.LoginPage.SignInButtonText} color='blue' onClick={this.handleSubmitClick} />

					        { false &&
					        	<Divider id="logInDivider" fitted />
					        }
					    </Form>
					    { false &&
					    	<Fragment>
					    		<Label size="large" id="createAccountOrLabel" circular>or</Label>
					   			<Button fluid id="createAccountButton" color='grey' onClick={this.onCreateAccountClick}> Create Account </Button>
					   		</Fragment>
						}
					</Segment>
				</div>
			</div>
		)
	}
}))