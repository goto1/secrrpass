import React, { Component } from 'react';
import { Redirect } from 'react-router';
import CardLayout from '../layouts/card';
import { InputField } from '../views/input-field';
import ButtonBuilder from '../views/buttons';
import API from '../../utils/api';
import UserUtils from '../../utils/user';
import ErrorHandler from '../../utils/error-handler';
import { formField, updateFormFields, checkIfValidForm } from '../../utils/form';

class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			formFields: {
				password: formField({
					type: 'password',
					name: 'password',
					placeholder: 'E^:24V)6F*lMS>M',
					onChange: this.handleChange.bind(this),
				}, 'Enter your master password')
			},
			formValid: false,
			formSubmitted: false,
			invalidPassword: true,
		};

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentWillUnmount() {

		if (this.checkIfLoginSuccessful) {
			this.checkIfLoginSuccessful.unsubscribe();
		}		
	}

	handleChange(event) {
		const formFields = updateFormFields(event, this.state.formFields);
		const formValid = checkIfValidForm(formFields);

		this.setState({ formFields, formValid });
	}

	handleSubmit(event) {
		event.preventDefault();

		const userID = UserUtils.getUserID();
		const password = this.state.formFields.password.attr.value;

		this.checkIfLoginSuccessful = API.checkIfMasterPasswordIsCorrect(userID, password)
			.subscribe(
				correct => {
					if (correct) {
						UserUtils.login();
						this.setState({ formSubmitted: true, invalidPassword: false });
					} else {
						this.setState({ formSubmitted: true });
					}
				},
				err => ErrorHandler.log({
					err: new Error(`Coudln't log in the user`),
					location: 'login.js:64',
				})
			);
	}

	render() {
		const userID = UserUtils.getUserID();
		const { formValid, formFields, invalidPassword, formSubmitted } = this.state;
		const SubmitButton = new ButtonBuilder()
			.setType('submit')
			.setName('Log In')
			.setDisabled(!formValid)
			.render();

		if (invalidPassword === false) {
			const path = `/${userID}`;

			return <Redirect to={path} />;
		}

		return (
			<CardLayout heading='Log in'>
				<form onSubmit={this.handleSubmit}>
					<InputField {...formFields.password} />

					<div style={{ width: '100%', textAlign: 'center' }}>
						{ SubmitButton }
						{ invalidPassword && formSubmitted &&
							<div style={{
								marginTop: '15px',
								color: 'red',
								textTransform: 'uppercase',
								letterSpacing: '1.5px',
								fontSize: '12.5px',
							}}>
								Invalid Password
							</div>
						}
					</div>
				</form>
			</CardLayout>
		);
	}
}

export default Login;