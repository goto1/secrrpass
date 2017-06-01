import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import CardLayout from '../layouts/card';
import { InputField } from '../views/input-field';
import SuccessfulSubmission from '../views/successful-submission';
import * as _ from 'lodash';
import PasswordGeneratorForm from './password-generator-form';
import Loader from '../views/loader';
import ButtonBuilder from '../views/buttons';
import { API, FormUtils, UserUtils, ErrorHandler } from '../../utils/utils';

class EditPassword extends Component {
	constructor(props) {
		super(props);

		this.state = {
			formFields: {
				name: FormUtils.formField({
					type: 'text',
					name: 'name',
					placeholder: 'Gmail',
					onChange: this.handleChange.bind(this),
				}, 'Change the name'),
				username: FormUtils.formField({
					type: 'text', 
					name: 'username', 
					placeholder: 'example@gmail.com',
					onChange: this.handleChange.bind(this),
				}, 'Change your username'),
				password: FormUtils.formField({
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
		const passID = this.props.match.params.passwordID;

		if (API.isPasswordIDValid(passID) === false) { return; }

		API.getPassword(passID)
			.then(passInfo => {
				if (passInfo !== null) {
					const { serviceName, userName, password } = passInfo;
					const formFields = { ...this.state.formFields };

					formFields.name.attr.value = serviceName;
					formFields.username.attr.value = userName;
					formFields.password.attr.value = password;

					_.forEach(formFields, (value, key) => formFields[key].valid = true);

					this.setState({ formFields, loading: false, createdAt: passInfo.createdAt });
				}
			})
			.catch(err => ErrorHandler.log({ err, location: 'edit-password.js:68' }));
	}

	componentWillUnmount() {
		// cleanup
		if (this.updatePass) { this.updatePass.unsubscribe(); }
	}

	handleSubmit(event) {
		event.preventDefault();

		const passwordID = this.props.match.params.passwordID;
		const { name, username, password } = this.state.formFields;
		const updatedPass = {
			id: passwordID,
			serviceName: name.attr.value,
			userName: username.attr.value,
			password: password.attr.value,
			createdAt: this.state.createdAt,
		};

		this.updatePass = API.updatePassword(updatedPass)
			.subscribe(
				res => this.setState({ formSubmitted: true }),
				err => ErrorHandler.log({ err, location: 'edit-password.js:93' })
			);
	}

	handleChange(event) {
		const formFields = FormUtils.updateFormFields(event, this.state.formFields);
		const formValid = FormUtils.checkIfValidForm(formFields);

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

	render() {
		const styles = this.getStyles();
		const { name, username, password } = this.state.formFields;
		const { loading, formSubmitted, showPasswordGenerator, formValid } = this.state;
		const { handleSubmit, togglePasswordGenerator } = this;

		const SubmitBtn = new ButtonBuilder()
			.setType('submit')
			.setName('Submit')
			.setDisabled(!formValid)
			.render();
		const ShowPasswordGeneratorBtn = new ButtonBuilder()
			.setType('button')
			.setName('Password generator')
			.setAction(togglePasswordGenerator)
			.render();

		if (loading) {
			return <Loader />;
		}

		if (formSubmitted) {
			const message = 'Your password was successfully updated!';
			const userID = UserUtils.getUserID();
			const home = () => this.props.history.push(`/${userID}`);

			return (
				<SuccessfulSubmission
					message={message}
					actionName='Home'
					action={home} 
				/>
			);
		}

		return (
			<CardLayout heading='Edit Password'>
				<form onSubmit={handleSubmit}>
					<InputField {...name} />
					<InputField {...username} />
					<InputField {...password} />

					<div style={styles.options}>
						{ ShowPasswordGeneratorBtn }
						{ SubmitBtn }
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