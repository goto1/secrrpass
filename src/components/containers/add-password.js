import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import firebase from '../../utils/firebase';
import PasswordGeneratorForm from './password-generator-form';
import { InputField } from '../views/input-field';
import SuccessfulSubmission from '../views/successful-submission';
import CardLayout from '../layouts/card';
import { 
	genSubmitBtn,
	genDefaultBtn,
	formField, 
	updateFormFields,
	checkIfValidForm,
	resetForm } from '../../utils/form';

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

		this.handleSubmit = this.handleSubmit.bind(this);
		this.showAndResetForm = this.showAndResetForm.bind(this);
		this.onPasswordGenerated = this.onPasswordGenerated.bind(this);
		this.togglePasswordGenerator = this.togglePasswordGenerator.bind(this);
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
			serviceName: name.attr.value,
			userName: username.attr.value,
			password: password.attr.value,
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

	getStyles() {
		return {
			formOptions: {
				display: 'flex',
				justifyContent: 'space-between',
				margin: '25px auto',
			},
		};
	}

	render() {
		const { name, username, password } = this.state.formFields;
		const PasswordGenerator = 
			<PasswordGeneratorForm onGenerated={this.onPasswordGenerated} />;
		const SubmitButton = genSubmitBtn('Submit', this.state.formValid);
		const ShowPasswordGeneratorButton = 
			genDefaultBtn('Password generator', this.togglePasswordGenerator);
		const styles = this.getStyles();

		if (this.state.formSubmitted) {
			const serviceName = <span style={{ color: '#EF5A40' }}>{name.attr.value}</span>;
			const message = <div>Your password {serviceName} was created!</div>;
			const showAndResetForm = this.showAndResetForm;

			return (
				<div>
					<SuccessfulSubmission
						message={message}
						actionName='Add another password'
						action={showAndResetForm} 
					/>
				</div>
			);
		}

		return (
			<div>
				<CardLayout heading='Add new password'>
					<form onSubmit={this.handleSubmit}>
						<InputField {...name} />
						<InputField {...username} />
						<InputField {...password} />

						<div style={styles.formOptions}>
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
			</div>
		);
	}
}

export default AddPasswordForm;