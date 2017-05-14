import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import firebase from '../../utils/firebase';
import PasswordGeneratorForm from './password-generator-form';
import { InputField } from '../views/input-field';
import CardLayout from '../layouts/card';
import { 
	genSubmitBtn,
	genDefaultBtn,
	formField, 
	updateFormFields,
	checkIfValidForm,
	resetForm } from '../../utils/form';

function SuccessfulSubmission({ serviceName, showForm }) {
	const styles = {
		container: {
			textAlign: 'center',
			marginTop: '25%',
			padding: '20px',
			fontWeight: '200',
			letterSpacing: '2px',
			lineHeight: '35px',
		},
		message: {
			margin: '30px 0',
			fontSize: '22.5px',
			textTransform: 'uppercase',
			color: '#F3F3F5',
		},
		span: { color: '#EF5A40' },
		button: {
			display: 'flex',
			justifyContent: 'space-between',
			margin: '25px auto',
		},
	};
	const backButton = genDefaultBtn('Add another password', showForm);

	return (
		<div style={styles.container}>
			<div style={styles.message}>
				<div>
					Your <span style={styles.span}>{serviceName}</span> password was created!
				</div>
			</div>
			<div style={styles.message}>
				{ backButton }
			</div>
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

		return (
			<div>
				{ !this.state.formSubmitted ? (
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
				) : (
					<SuccessfulSubmission
							serviceName={name.attr.value}
							showForm={this.showAndResetForm} />
				) }
			</div>
		);
	}
}

export default AddPasswordForm;