import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Card from './layouts/card';
import formUtils from '../utils/form';
import firebase from '../utils/firebase';
import securityUtils from '../utils/security-utils';
import './settings.css';

const SuccessfulSubmission = ({ message, action }) => (
	<div className='SuccessfulSubmission'>
		{message}
		<button type="button" onClick={action}>Go Back</button>
	</div>
);

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
		this.goBack = this.goBack.bind(this);
	}

	// componentWillUnmount() {
	// 	firebase.setMasterPassword(userID, value).unsubscribe();
	// }

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
		const { checkIfFormValid, checkIfFieldsMatching } = formUtils;
		const { formFields } = this.state;
		const { password, passwordRepeated } = this.state.formFields;

		return checkIfFormValid(formFields) && checkIfFieldsMatching(password, passwordRepeated);
	}

	goBack() {
		this.setState({
			formFields: {
				password: { value: '', valid: false },
				passwordRepeated: { value: '', valid: false },
			},
			submitted: false,
			error: false,
		});
	}

	render() {
		const isFormValid = this.checkIfValidForm();
		const submissionMessage = 'Your master password was successfully set!';

		return (
			<div>
				{ this.state.submitted ? (
					<SuccessfulSubmission 
						message={submissionMessage} 
						action={this.goBack} />
				) : (
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
				) }
			</div>
		);
	}
}

class ChangePasswordForm extends Component {
	constructor() {
		super();
		this.state = {
			formFields: {
				currPass: { value: '', valid: false },
				newPass: { value: '', valid: false },
				newPassRepeated: { value: '', valid: false },
			},
			submitted: false,
			error: false,
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleInputFieldChange = this.handleInputFieldChange.bind(this);
		this.checkIfValidForm = this.checkIfValidForm.bind(this);
		this.goBack = this.goBack.bind(this);
	}

	handleSubmit(event) {
		event.preventDefault();
		const { currPass, newPass, newPassRepeated } = this.state.formFields;
		const userID = localStorage.getItem('userID');

		const extract = data => data.val();

		firebase.getMasterPassword(userID)
			.map(extract)
			.subscribe(
				(hash) => {
					if (securityUtils.compareHashToPassword(currPass.value, hash)) {
						firebase.setMasterPassword(userID, newPass.value).subscribe();
						this.setState({ submitted: true });
					} else {
						this.setState({ error: true });
					}
				},
				(err) => { console.log(err); },
			);
	}

	handleInputFieldChange({ name, value }) {
		const item = { value, valid: value.length > 0 ? true : false };
		const updated = {...this.state.formFields, [name]: item};
		
		this.setState({ formFields: updated });
	}

	checkIfValidForm() {
		const { checkIfFormValid, checkIfFieldsMatching } = formUtils;
		const { formFields } = this.state;
		const { newPass, newPassRepeated } = this.state.formFields;

		return checkIfFormValid(formFields) && checkIfFieldsMatching(newPass, newPassRepeated);
	}

	goBack() {
		this.setState({
			formFields: {
				currPass: { value: '', valid: false },
				newPass: { value: '', valid: false },
				newPassRepeated: { value: '', valid: false },
			},
			submitted: false,
			error: false,
		});
	}

	render() {
		const isFormValid = this.checkIfValidForm();
		console.log(this.state.submitted);

		return (
			<div>
				{ this.state.submitted ? (
					<SuccessfulSubmission
						message='You have successfully changed your master password!'
						action={this.goBack} />
				) : (
					<form className="Form" onSubmit={this.handleSubmit}>
						<TextInputField
							name="currPass"
							placeholder="Current password"
							onChange={this.handleInputFieldChange} />
						<TextInputField
							name="newPass"
							placeholder="New password"
							onChange={this.handleInputFieldChange} />
						<TextInputField
							name="newPassRepeated"
							placeholder="Repeat new password"
							onChange={this.handleInputFieldChange} />
						<input type="submit" value="Submit" disabled={!isFormValid} />
					</form>
				) }
			</div>
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
