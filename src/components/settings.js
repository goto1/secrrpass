import React, { Component } from 'react';
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

class ChangeUsernameForm extends Component {
	constructor() {
		super();
		this.state = { username: '', password: '' };
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleInputFieldChange = this.handleInputFieldChange.bind(this);
	}

	handleSubmit(event) {
		event.preventDefault();
		const { username, password } = this.state;
		// TODO: handle username change
	}

	handleInputFieldChange({ name, value }) {
		this.setState({ [name]: value });
	}

	render() {
		return (
			<form className="Form" onSubmit={this.handleSubmit}>
				<TextInputField
					name="username" 
					placeholder="New username"
					onChange={this.handleInputFieldChange} />
				<TextInputField
					name="password"
					placeholder="Current password"
					onChange={this.handleInputFieldChange} />
				<input type="submit" value="Submit" />
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
		const { newPassword } = this.state;
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
		const { password } = this.state;
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
		return (
			<div className="SettingsOption">
				<div className="Description">
					<div>{desc}</div>
					<div>
						<i 
							className="fa fa-angle-down" 
							aria-hidden="true" 
							onClick={this.toggleShowForm} />
					</div>
				</div>
				{ showForm && form }
			</div>
		);
	}
}

const ChangeUsernameOption = () => {
	const form = <ChangeUsernameForm />;
	return <SettingsOption desc="Change Username" form={form} />;
};

const ChangePasswordOption = () => {
	const form = <ChangePasswordForm />;
	return <SettingsOption desc="Change Password" form={form} />;
};

const DeleteAccountOption = () => {
	const form = <DeleteAccountForm />;
	return <SettingsOption desc="Delete Account" form={form} />;
}

class Settings extends Component {
	render() {
		return (
			<div className="Card">
				<h2 className="CardHeading">Settings</h2>
				<ChangeUsernameOption />
				<ChangePasswordOption />
				<DeleteAccountOption />
			</div>
		);
	}
}

export default Settings;
