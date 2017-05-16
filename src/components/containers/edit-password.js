import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import CardLayout from '../layouts/card';
import { InputField } from '../views/input-field';
import { formField, updateFormFields } from '../../utils/form';
import SuccessfulSubmission from '../views/successful-submission';
import { forEach } from 'lodash';
import PasswordGeneratorForm from './password-generator-form';
import { handleError } from '../../utils/error-handler';
import { getPasswordDetails, updatePassword } from '../../utils/api';
import { extractData, decryptPasswordInfo } from '../../utils/response-handler';
import Loader from '../views/loader';
import {
	genSubmitBtn,
	genDefaultBtn,
	checkIfValidForm } from '../../utils/form';

function extractPasswordID(url) {
	const dashPosition = url.indexOf('-');

	return url.slice(dashPosition);
}

class EditPassword extends Component {
	constructor(props) {
		super(props);

		this.state = {
			formFields: {
				name: formField({
					type: 'text',
					name: 'name',
					placeholder: 'Gmail',
					onChange: this.handleChange.bind(this),
				}, 'Change the name'),
				username: formField({
					type: 'text', 
					name: 'username', 
					placeholder: 'example@gmail.com',
					onChange: this.handleChange.bind(this),
				}, 'Change your username'),
				password: formField({
					type: 'text',
					name: 'password',
					placeholder: 'Enter or generate your password',
					onChange: this.handleChange.bind(this),
				}, 'Change your password'),
			},
			formValid: true,
			formSubmitted: false,
			showPasswordGenerator: false,
			loading: true,
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.togglePasswordGenerator = this.togglePasswordGenerator.bind(this);
		this.generatePasswordEvent = this.generatePasswordEvent.bind(this);
	}

	componentDidMount() {
		const userID = localStorage.getItem('userID');
		const passwordID = extractPasswordID(this.props.match.url);

		this.getPasswordDetails = 
			getPasswordDetails(userID, passwordID)
				.map(extractData)
				.map(decryptPasswordInfo)
				.subscribe(
					(response) => {
						const { serviceName, userName, password } = response;
						const formFields = Object.assign({}, this.state.formFields);
						
						formFields.name.attr.value = serviceName;
						formFields.username.attr.value = userName;
						formFields.password.attr.value = password;

						forEach(formFields, (value, key) => {
							formFields[key].valid = true;
						});

						this.setState({ 
							formFields, 
							loading: false, 
							passwordCreatedAt: response.createdAt 
						});
					},
					(err) => {
						handleError(new Error('Could not retrieve user\'s password information'));
					}
				);
	}

	handleSubmit(event) {
		event.preventDefault();

		const userID = localStorage.getItem('userID');
		const passwordID = this.props.match.params.passwordID;
		const { name, username, password } = this.state.formFields;

		const updated = {
			id: passwordID,
			serviceName: name.attr.value,
			userName: username.attr.value,
			password: password.attr.value,
			createdAt: this.state.passwordCreatedAt,
		};

		this.updatePassword = 
			updatePassword(userID, updated)
				.subscribe(
					() => { this.setState({ formSubmitted: true }); },
					(err) => {
						handleError(new Error('Error while updating password information'));
					}
				);
	}

	handleChange(event) {
		const formFields = updateFormFields(event, this.state.formFields);
		const formValid = checkIfValidForm(formFields);

		this.setState({ formFields, formValid });
	}

	togglePasswordGenerator() {
		this.setState({
			showPasswordGenerator: !this.state.showPasswordGenerator
		});
	}

	generatePasswordEvent(password) {
		const event = {
			target: {
				name: 'password',
				value: password,
			},
		};

		this.handleChange(event);
	}

	getStyles() {
		return {
			options: {
				display: 'flex',
				justifyContent: 'space-between',
				margin: '25px auto',
			},
		};
	}

	componentWillUnmount() {
		this.getPasswordDetails.unsubscribe();
		
		if (this.formSubmitted) {
			this.updatePassword.unsubscribe();
		}
	}

	render() {
		const styles = this.getStyles();
		const { name, username, password } = this.state.formFields;
		const { loading, formSubmitted, showPasswordGenerator } = this.state;
		const handleSubmit = this.handleSubmit;
		const SubmitButton = genSubmitBtn('Submit', this.state.formValid);
		const PasswordGeneratorButton = genDefaultBtn('Password generator', this.togglePasswordGenerator);

		if (loading) {
			return <Loader />;
		}

		if (formSubmitted) {
			const msg = 'Your password item was sucessfully updated!';
			const userID = localStorage.getItem('userID');
			const goToHome = () => this.props.history.push(`/${userID}`);
			
			return (
				<SuccessfulSubmission
					message={msg}
					actionName='Home'
					action={goToHome}
			 	/>
			);
		}

		return (
			<CardLayout heading="Edit Password">
				<form onSubmit={handleSubmit}>
					<InputField {...name} />
					<InputField {...username} />
					<InputField {...password} />

					<div style={styles.options}>
						{ PasswordGeneratorButton }
						{ SubmitButton }
					</div>
				</form>

				<ReactCSSTransitionGroup
					transitionName="pass-gen-transition"
					transitionEnterTimeout={200}
					transitionLeaveTimeout={300}>
					{ showPasswordGenerator && 
						<PasswordGeneratorForm onGenerated={this.generatePasswordEvent} /> }
				</ReactCSSTransitionGroup>
			</CardLayout>
		);
	}
}

export default EditPassword;