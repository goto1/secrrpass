import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PasswordGeneratorForm from './password-generator-form';
import FormUtils from '../../utils/form';
import firebase from '../../utils/firebase';
import Card from '../layouts/card';
import './add-password.css';

const SuccessfulSubmission = (props) => (
	<div className="SuccessfulSubmission">
		<div>Success!</div>
		<div>Your <span>{props.serviceName}</span> was created.</div>
		<button onClick={props.showForm}>Add Another Password</button>
	</div>
);

const GenereateNewPasswordBtn = ({ onClick }) => (
	<button 
		type="button" 
		className="GenerateNewPasswordBtn"
		onClick={onClick}>
		Generate New Password
	</button>
);

const TextInputField = (props) => {
	const styles = { borderBottomColor: '' };
	const { 
		value, placeholder, 
		handleChange, valid, 
		desc, touched, name } = props;

	if (touched && !valid) {
		styles.borderBottomColor = '#CC0000';
	} else if (touched > 0) {
		styles.borderBottomColor = '#35D235';
	}

	return (
		<div className="TextInputField">
			<label>
				<span>{desc}</span>
				<input 
					type="text"
					value={value}
					name={name}
					style={styles}
					onChange={handleChange}
					placeholder={placeholder} />
			</label>
		</div>
	);
}

class AddPasswordForm extends Component {
	constructor() {
		super();
		this.state = {
			formFields: {
				name: { value: '', valid: false, touched: false },
				username: { value: '', valid: false, touched: false },
				password: { value: '', valid: false, touched: false },
			},
			showPassGenerator: false,
			submitted: false,
			error: false,
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.onPassGenerated = this.onPassGenerated.bind(this);
		this.togglePassGenerator = this.togglePassGenerator.bind(this);
		this.showAndResetForm = this.showAndResetForm.bind(this);
	}

	showAndResetForm() {
		this.setState({
			formFields: {
				name: { value: '', valid: false, touched: false },
				username: { value: '', valid: false, touched: false },
				password: { value: '', valid: false, touched: false },
			},
			submitted: false,
			error: false,
		});
	}

	togglePassGenerator() {
		this.setState({ showPassGenerator: !this.state.showPassGenerator });
	}

	handleSubmit(event) {
		event.preventDefault();

		const userID = localStorage.getItem('userID');
		const { formFields } = this.state;
		const password = {
			serviceName: formFields.name.value,
			userName: formFields.name.value,
			password: formFields.password.value,
		};

		firebase.createNewPassword(userID, password)
			.subscribe(
				() => { this.setState({ submitted: true }); },
				() => { this.setState({ error: true })}
			);
	}

	handleInputChange(event) {
		const { name, value } = event.target;
		const updatedFormFields = {
			...this.state.formFields,
			[name]: {
				value: value,
				valid: value.length > 0 ? true : false,
				touched: true,
			},
		};

		this.setState({ formFields: updatedFormFields });
	}

	onPassGenerated(pass) {
		const password = { 
			value: pass, 
			valid: pass.length > 0 ? true : false,
			touched: true 
		};
		const formFields = {...this.state.formFields, password};
		this.setState({ formFields });
	}

	render() {
		const passGenerator = <PasswordGeneratorForm onGenerated={this.onPassGenerated} />
		const { formFields, error, submitted } = this.state;
		const isFormValid = FormUtils.checkIfFormValid(formFields);
		
		return (
			<div>
				{ error && <div>Error!</div> }

				{ !submitted ? (
					<Card heading="Add New Password">
						<form onSubmit={this.handleSubmit}>
							<TextInputField
								name="name"
								placeholder="Gmail"
								desc="Name"
								value={formFields.name.value} 
								touched={formFields.name.touched}
								valid={formFields.name.valid}
								handleChange={this.handleInputChange} />
							<TextInputField
								name="username"
								placeholder="example@gmail.com"
								desc="Username or email address"
								value={formFields.username.value}
								touched={formFields.username.touched} 
								valid={formFields.username.valid}
								handleChange={this.handleInputChange} />
							<TextInputField
								name="password"
								placeholder="Enter or create your password"
								desc="Enter or create your password" 
								value={formFields.password.value}
								touched={formFields.password.touched}
								valid={formFields.password.valid} 
								handleChange={this.handleInputChange} />
							<div className="FormOptions">
								<GenereateNewPasswordBtn
									onClick={this.togglePassGenerator} />
								<input 
									type="submit" 
									value="Create" 
									disabled={!isFormValid} />
							</div>
						</form>
						<ReactCSSTransitionGroup
							transitionName="pass-gen-transition"
							transitionEnterTimeout={200}
							transitionLeaveTimeout={300}>
							{this.state.showPassGenerator && passGenerator}
						</ReactCSSTransitionGroup>
					</Card>
				) : (
					<SuccessfulSubmission
						serviceName={formFields.name.value}
						showForm={this.showAndResetForm} />
				) }
			</div>
		);
	}
}

export default AddPasswordForm;