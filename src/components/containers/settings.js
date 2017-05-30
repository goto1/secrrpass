import React, { Component } from 'react';
import { Redirect } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Card from '../layouts/card';
import ButtonBuilder from '../views/buttons';
import SuccessfulSubmission from '../views/successful-submission';
import './settings.css';

import { UserUtils, FormUtils, API, ErrorHandler } from '../../utils/utils';

function genSuccSubmissionMessage({ message, push }) {
	const userID = UserUtils.getUserID();
	let action = null;
	
	if (userID) {
		action = () => push(`/${userID}`);
	} else {
		action = () => push(`/`);
	}

	return (
		<SuccessfulSubmission
			message={message}
			actionName='Home'
			action={action} 
		/>
	);
}

function generateFormFieldAttributes({ name, placeholder, onChange }) {
	return {
		attr: {
			type: 'text',
			name: name,
			placeholder: placeholder,
			onChange: onChange,
		},
		touched: false,
		valid: false,
	}
}

function generateFormAttributes(formFields) {
	return {
		formFields: formFields,
		formSubmitted: false,
		formValid: false,
		showForm: false,
	};
}

function Heading({ title, showForm, toggleFormAction }) {
	const styles = {
		container: {
			display: 'flex',
			justifyContent: 'space-between',
			color: '#F1F1F4',
			padding: '7.5px 10px 7.5px 5px',
			fontWeight: '300',
			fontSize: '17.5px',
			letterSpacing: '1.25px',
			marginBottom: '15px',
			borderBottomStyle: 'solid',
			borderBottomWidth: '3px',
			borderBottomColor: '#1F224A',
			transition: 'all 500ms ease-in-out',
		},
		icon: { transition: 'all 500ms ease-in-out', },
		iconActive: { transform: 'rotate(180deg)', },
	};

	return (
		<div style={showForm ? {...styles.container, borderBottomColor: '#EF5A40'} : styles.container}>
			<div>
				{ title }
			</div>

			<div>
				<i 
					style={showForm ? {...styles.icon, ...styles.iconActive} : styles.icon}
					className='fa fa-angle-down'
					onClick={toggleFormAction}
				/>
			</div>
		</div>
	);
}

function Form({ formAttributes, children }) {
	const styles = {
		borderRadius: '5px',
		background: '#F1F1F4',
		padding: '15px 20px',
		margin: '15px 0',
		textAlign: 'right',
		overflow: 'hidden',
	};

	const { title, showForm, toggleForm, handleSubmit } = formAttributes;
	const formElements = children;

	return (
		<div>
			<Heading 
				title={title}
				showForm={showForm}
				toggleFormAction={toggleForm}
			/>

			<ReactCSSTransitionGroup
				transitionName='form-transition'
				transitionEnterTimeout={500}
				transitionLeaveTimeout={450}>
					{ showForm &&
						<div style={styles}>
							<form onSubmit={handleSubmit}>
								{formElements}
							</form>
						</div> }
			</ReactCSSTransitionGroup>
		</div>
	);
}

function InputField({ attr, touched, valid }) {
	const styles = {
		display: 'block',
		border: 'none',
		background: 'inherit',
		paddingBottom: '2.5px',
		borderBottom: '2.5px solid #2D3665',
		width: '100%',
		margin: '5px auto 20px auto',
		fontSize: '17.5px',
		color: '#1F224A',
		borderBottomWidth: '2px',
		borderBottomStyle: 'solid',
	};

	if (touched && !valid) {
		styles.borderBottomColor = '#CC0000';
	} else if (touched) {
		styles.borderBottomColor = '#35D235';
	}

	return <input style={styles} {...attr} />;
}

class SetMasterPassword extends Component {
	constructor(props) {
		super(props);

		this.state = generateFormAttributes({
			masterPassword: generateFormFieldAttributes({
				name: 'masterPassword',
				placeholder: 'Master Password',
				onChange: this.handleChange.bind(this),
			}),
			masterPasswordRepeated: generateFormFieldAttributes({
				name: 'masterPasswordRepeated',
				placeholder: 'Repeat Password',
				onChange: this.handleChange.bind(this),
			}),
		});

		this.handleSubmit = this.handleSubmit.bind(this);
		this.toggleForm = this.toggleForm.bind(this);
	}

	componentWillUnmount() {
		if (this.setMasterPassword) { this.setMasterPassword.unsubscribe(); }
	}

	handleSubmit(event) {
		event.preventDefault();

		const password = this.state.formFields.masterPassword.attr.value;

		this.setMasterPassword = API.setMasterPassword(password).subscribe(
			res => this.setState({ formSubmitted: true }),
			err => ErrorHandler.log({ err, location: 'settings.js:181' })
		);
	}

	handleChange(event) {
		const formFields = FormUtils.updateFormFields(event, this.state.formFields);
		const formValid = FormUtils.checkIfValidForm(formFields);

		this.setState({ formFields, formValid });
	}

	toggleForm() {
		this.setState({ showForm: !this.state.showForm });
	}

	render() {
		const { formValid, showForm, formFields, formSubmitted } = this.state;
		const { handleSubmit, toggleForm } = this;
		const formAttributes = {
			title: 'Set Master Password',
			showForm: showForm,
			toggleForm: toggleForm,
			handleSubmit: handleSubmit,
		};
		const SubmitBtn = new ButtonBuilder()
										.setType('submit-settings')
										.setName('Submit')
										.setDisabled(!formValid)
										.render();

		if (formSubmitted) {
			return <Redirect to={'/' + UserUtils.getUserID()} />
		}

		return (
			<Form formAttributes={formAttributes}>
				<InputField {...formFields.masterPassword} />
				<InputField {...formFields.masterPasswordRepeated} />
				{ SubmitBtn }
			</Form>
		);
	}
}

class ChangeMasterPassword extends Component {
	constructor(props) {
		super(props);

		this.state = generateFormAttributes({
			currentPassword: generateFormFieldAttributes({
				name: 'currentPassword',
				placeholder: 'Current Password',
				onChange: this.handleChange.bind(this),
			}),
			newMasterPassword: generateFormFieldAttributes({
				name: 'newMasterPassword',
				placeholder: 'New Password',
				onChange: this.handleChange.bind(this),
			}),
			newMasterPasswordRepeated: generateFormFieldAttributes({
				name: 'newMasterPasswordRepeated',
				placeholder: 'Repeat Password',
				onChange: this.handleChange.bind(this),
			}),
		});

		this.handleSubmit = this.handleSubmit.bind(this);
		this.toggleForm = this.toggleForm.bind(this);
	}

	componentWillUnmount() {
		if (this.updateMasterPassword) { this.updateMasterPassword.unsubscribe(); }
	}

	handleSubmit(event) {
		event.preventDefault();

		const { currentPassword, newMasterPassword } = this.state.formFields;
		const currPassVal = currentPassword.attr.value;
		const newMPassVal = newMasterPassword.attr.value;

		this.updateMasterPassword = 
			API.checkIfValidMasterPassword(currPassVal).subscribe(
				match => {
					if (match !== false) {
						API.setMasterPassword(newMPassVal).subscribe(
							res => this.setState({ formSubmitted: true })
						);
					}
				},
				err => ErrorHandler.log({ err, location: 'settings.js:273' })
			);
	}

	handleChange(event) {
		const formFields = FormUtils.updateFormFields(event, this.state.formFields);
		const mPass = formFields.newMasterPassword.attr;
		const mPassRepeated = formFields.newMasterPasswordRepeated.attr;
		const formValid = 
			FormUtils.checkIfValidForm(formFields) && 
			FormUtils.checkIfMatchingFields(mPass, mPassRepeated);

		this.setState({ formFields, formValid });
	}

	toggleForm() {
		this.setState({ showForm: !this.state.showForm });
	}

	render() {
		const { formValid, showForm, formFields, formSubmitted } = this.state;
		const { handleSubmit, toggleForm } = this;
		const formAttributes = {
			title: 'Change Master Password',
			showForm: showForm,
			toggleForm: toggleForm,
			handleSubmit: handleSubmit,
		};
		const SubmitBtn = new ButtonBuilder()
												.setType('submit-settings')
												.setName('Submit')
												.setDisabled(!formValid)
												.render();

		if (formSubmitted) {
			return <Redirect to={'/' + UserUtils.getUserID()} />
		}

		return (
			<Form formAttributes={formAttributes}>
				<InputField {...formFields.currentPassword} />
				<InputField {...formFields.newMasterPassword} />
				<InputField {...formFields.newMasterPasswordRepeated} />
				{ SubmitBtn }
			</Form>
		);
	}
}

class DeleteAccount extends Component {
	constructor(props) {
		super(props);

		this.state = { formSubmitted: false, showForm: false };

		this.handleSubmit = this.handleSubmit.bind(this);
		this.toggleForm = this.toggleForm.bind(this);
	}

	handleSubmit(event) {
		event.preventDefault();

		API.deleteUser()
			.then(res => this.setState({ formSubmitted: true }))
			.catch(err => ErrorHandler({ err, location: 'settings.js:354' }));
	}

	toggleForm() {
		this.setState({ showForm: !this.state.showForm });
	}

	render() {
		const { showForm, formSubmitted } = this.state;
		const formAttributes = {
			title: 'Delete Account',
			showForm: showForm,
			toggleForm: this.toggleForm,
			handleSubmit: this.handleSubmit,
		};

		const SubmitBtn = new ButtonBuilder()
												.setType('submit-settings')
												.setName('Delete')
												.setDisabled(false)
												.render();

		if (formSubmitted) {
			return <Redirect to='/' />;
		}

		return (
			<Form formAttributes={formAttributes}>
				{ SubmitBtn }
			</Form>
		);
	}
}

function Settings(props) {
	const isSessionExpired = UserUtils.isSessionExpired();
	const isAccountProtected = UserUtils.isAccountProtected();

	if (isAccountProtected && isSessionExpired) {
		return <Redirect to='/login' />;
	}

	return (
		<Card heading='Settings'>
			{ isAccountProtected &&
				!isSessionExpired &&
				<ChangeMasterPassword /> }
			{ !isAccountProtected && <SetMasterPassword /> }
			<DeleteAccount {...props} />
		</Card>
	);
}

export default Settings;