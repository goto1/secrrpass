import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import firebase from '../../utils/firebase';
import PasswordGeneratorForm from './password-generator-form';
import InputField from '../views/input-field';
import CardLayout from '../layouts/card';
import { 
	genSubmitBtn,
	genDefaultBtn,
	formField, 
	updateFormFields,
	checkIfValidForm,
	resetForm } from '../../utils/form';
import './add-password.css';

function SuccessfulSubmission({ serviceName, showForm }) {
	return (
		<div className="SuccessfulSubmission">
			<div>Success!</div>
			<div>Your <span>{serviceName}</span> was created.</div>
			<button onClick={showForm}>Add Another Password</button>
		</div>
	);
}

class AddPasswordForm extends Component {
	constructor() {
		super();

		this.state = {
			formFields: {
				name: formField({
					type: 'text',
					name: 'name',
					placeholder: 'Gmail',
					onChange: this.handleChange.bind(this),
				}, 'Name'),
				username: formField({
					type: 'text',
					name: 'username',
					placeholder: 'example@gmail.com',
					onChange: this.handleChange.bind(this),
				}, 'Username or email address'),
				password: formField({
					type: 'text',
					name: 'password',
					placeholder: 'E^:24V)6F*lMS>M',
					onChange: this.handleChange.bind(this),
				}, 'Enter or generate a new password')
			},
			formValid: false,
			formSubmitted: false,
			showPasswordGenerator: false,
		};

		this.togglePasswordGenerator = this.togglePasswordGenerator.bind(this);
		this.onPasswordGenerated = this.onPasswordGenerated.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this),
		this.showAndResetForm = this.showAndResetForm.bind(this);
	}

	handleChange(event) {
		const formFields = updateFormFields(event, this.state.formFields);
		const formValid = checkIfValidForm(formFields);

		this.setState({ formFields, formValid });
	}

	handleSubmit(event) {
		event.preventDefault();

		const userID = localStorage.getItem('userID');
		const { name, username, password } = this.state.formFields;
		const newPassword = {
			serviceName: name.value,
			userName: username.value,
			password: password.value,
		};

		firebase.createNewPassword(userID, newPassword)
			.subscribe(
				() => { this.setState({ formSubmitted: true }); }
			);
	}

	togglePasswordGenerator() {
		this.setState({ showPasswordGenerator: !this.state.showPasswordGenerator });
	}

	onPasswordGenerated(generatedPassword) {
		const event = {
			target: { name: 'password', value: generatedPassword },
		};

		this.handleChange(event);
	}

	showAndResetForm() {
		this.setState({ ...resetForm(this.state) });
	}

	render() {
		const { name, username, password } = this.state.formFields;
		const PasswordGenerator = 
			<PasswordGeneratorForm onGenerated={this.onPasswordGenerated} />;
		const SubmitButton = genSubmitBtn('Submit', this.state.formValid);
		const ShowPasswordGeneratorButton = 
			genDefaultBtn('Password generator', this.togglePasswordGenerator);

		return (
			<div>
				{ !this.state.formSubmitted ? (
					<CardLayout heading='Add new password'>
						<form onSubmit={this.handleSubmit}>
							<InputField {...name} />
							<InputField {...username} />
							<InputField {...password} />

							<div className="FormOptions">
								{ ShowPasswordGeneratorButton }
								{ SubmitButton }
							</div>
						</form>

						<ReactCSSTransitionGroup
							transitionName="pass-gen-transition"
							transitionEnterTimeout={200}
							transitionLeaveTimeout={300}>
							{ this.state.showPasswordGenerator && PasswordGenerator }
						</ReactCSSTransitionGroup>
					</CardLayout>
				) : (
					<SuccessfulSubmission
							serviceName={name.value}
							showForm={this.showAndResetForm} />
				) }
			</div>
		);
	}
}

export default AddPasswordForm;