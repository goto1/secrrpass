import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Card from './layouts/card';
import formUtils from '../utils/form';
import firebase from '../utils/firebase';
import './settings.css';

class TextInputField extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '',
			touched: false,
			valid: false,
		};
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		const value = event.target.value;
		const { onChange, name } = this.props;

		this.setState({
			value: value,
			valid: value.length > 0 ? true : false,
			touched: true,
		});

		onChange({ name, value });
	}

	render() {
		const { placeholder } = this.props;
		const { value, valid, touched } = this.state;
		let styles = {};

		if (touched && !valid) {
			styles = { borderBottom: '2px solid #CC0000' };
		} else if (touched) {
			styles = { borderBottom: '2px solid #35D235' };
		}

		return (
			<input 
				type="text"
				className="TextInputField" 
				style={styles}
				placeholder={placeholder}
				value={value}
				onChange={this.handleChange} />
		);
	}
}

class SetMasterPassword extends Component {
	constructor() {
		super();
		this.state = {
			formFields: {
				password: { value: '', valid: false },
				passwordRepeated: { value: '', valid: false },
			},
			submitted: false,
			error: false,
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleInputFieldChange = this.handleInputFieldChange.bind(this);
		this.checkIfValidForm = this.checkIfValidForm.bind(this);
	}

	handleSubmit(event) {
		event.preventDefault();
		const { value } = this.state.formFields.password;
		const userID = localStorage.getItem('userID');

		firebase.setMasterPassword(userID, value)
			.subscribe(
				() => this.setState({ submitted: true }),
				(err) => this.setState({ error: true }),
			);
	}

	handleInputFieldChange({ name, value }) {
		const item = { value, valid: value.length > 0 ? true : false };
		const updated = {...this.state.formFields, [name]: item};
		
		this.setState({ formFields: updated });
	}

	checkIfValidForm() {
		const { password, passwordRepeated } = this.state.formFields;
		const passwordMatching = password.value === passwordRepeated.value;

		return formUtils.checkIfFormValid(this.state.formFields) && passwordMatching;
	}

	render() {
		const isFormValid = this.checkIfValidForm();

		return (
			<form className='Form' onSubmit={this.handleSubmit}>
				<TextInputField
					name='password'
					placeholder='Master password'
					onChange={this.handleInputFieldChange} />
				<TextInputField
					name='passwordRepeated'
					placeholder='Repeat password'
					onChange={this.handleInputFieldChange} />
				<input type="submit" value="Submit" disabled={!isFormValid} />
			</form>
		);
	}
}

class ChangePasswordForm extends Component {
	constructor() {
		super();
		this.state = { currPassword: '', newPassword: '', newPasswordRepeated: '' };
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleInputFieldChange = this.handleInputFieldChange.bind(this);
	}

	handleSubmit(event) {
		event.preventDefault();
		// const { newPassword } = this.state;
		// TODO: handle password change
	}

	handleInputFieldChange({ name, value }) {
		this.setState({ [name]: value });
	}

	render() {
		return (
			<form className="Form" onSubmit={this.handleSubmit}>
				<TextInputField
					name="currPassword"
					placeholder="Current password"
					onChange={this.handleInputFieldChange} />
				<TextInputField
					name="newPassword"
					placeholder="New password"
					onChange={this.handleInputFieldChange} />
				<TextInputField
					name="newPasswordRepeated"
					placeholder="Repeat new password"
					onChange={this.handleInputFieldChange} />
				<input type="submit" value="Submit" />
			</form>
		);
	}
}

class DeleteAccountForm extends Component {
	constructor() {
		super();
		this.state = { password: '' };
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleInputFieldChange = this.handleInputFieldChange.bind(this);
	}

	handleSubmit(event) {
		event.preventDefault();
		// const { password } = this.state;
		// TODO: handle deletion of account
	}

	handleInputFieldChange({ name, value }) {
		this.setState({ [name]: value });
	}

	render() {
		return (
			<form className="Form" onSubmit={this.handleSubmit}>
				<TextInputField 
					name="password"
					placeholder="Current password"
					onChange={this.handleInputFieldChange} />
				<input 
					type="submit" 
					style={{ border: '3px solid red' }}
					value="Delete account" />
			</form>
		);
	}
}

class SettingsOption extends Component {
	constructor(props) {
		super(props);
		this.state = { showForm: false };
		this.toggleShowForm = this.toggleShowForm.bind(this);
	}

	toggleShowForm(event) {
		this.setState({ showForm: !this.state.showForm });
	}

	render() {
		const { showForm } = this.state;
		const { desc, form } = this.props;
		const iconClassNames = showForm ? 'fa fa-angle-down rotate' : 'fa fa-angle-down';
		const descStyles = showForm ? { borderBottomColor: '#EF5A40' } : { borderBottomColor: '#1F224A' };
		return (
			<div className="SettingsOption">
				<div className="Description" style={descStyles}>
					<div>{desc}</div>
					<div>
						<i 
							className={iconClassNames} 
							aria-hidden="true" 
							onClick={this.toggleShowForm} />
					</div>
				</div>
				<ReactCSSTransitionGroup
					transitionName="form-transition"
					transitionEnterTimeout={500}
					transitionLeaveTimeout={450}>
					{ showForm && form }
				</ReactCSSTransitionGroup>
			</div>
		);
	}
}

const SetMasterPasswordOption = () => {
	const form = <SetMasterPassword key='1' />
	return <SettingsOption desc='Set Master Password' form={form} />;
};

const ChangePasswordOption = () => {
	const form = <ChangePasswordForm key='1' />;
	return <SettingsOption desc="Change Password" form={form} />;
};

const DeleteAccountOption = () => {
	const form = <DeleteAccountForm key='1' />;
	return <SettingsOption desc="Delete Account" form={form} />;
}

const Settings = () => (
	<Card heading="Settings">
		<SetMasterPasswordOption />
		<ChangePasswordOption />
		<DeleteAccountOption />
	</Card>
);

export default Settings;
