import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import API from '../../utils/api';
import UserUtils from '../../utils/user';
import ErrorHandler from '../../utils/error-handler';
import PasswordGeneratorForm from './password-generator-form';
import { InputField } from '../views/input-field';
import SuccessfulSubmission from '../views/successful-submission';
import CardLayout from '../layouts/card';
import ButtonBuilder from '../views/buttons';
import { 
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

	componentWillUnmount() {
		if (this.createNewPassword) {
			this.createNewPassword.unsubscribe();
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
		const { name, username, password } = this.state.formFields;
		const newPassword = {
			serviceName: name.attr.value,
			userName: username.attr.value,
			password: password.attr.value,
		};

		this.createNewPassword = API.createNewPassword(userID, newPassword)
			.subscribe(
				res => this.setState({ formSubmitted: true }),
				err => ErrorHandler.log({
					err: new Error(`Couldn't create a new password`),
					location: 'add-password.js:78',
				})
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
		const styles = this.getStyles();
		const formValid = this.state.formValid;
		const { name, username, password } = this.state.formFields;
		const { togglePasswordGenerator, onPasswordGenerated } = this;

		const SubmitButton = 
			new ButtonBuilder()
				.setType('submit')
				.setName('Submit')
				.setDisabled(!formValid)
				.render();

		const ShowPasswordGeneratorButton =
			new ButtonBuilder()
				.setType('button')
				.setName('Password generator')
				.setAction(togglePasswordGenerator)
				.render();

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
						{ this.state.showPasswordGenerator && 
							<PasswordGeneratorForm onGenerated={onPasswordGenerated} /> }
					</ReactCSSTransitionGroup>
				</CardLayout>
			</div>
		);
	}
}

export default AddPasswordForm;