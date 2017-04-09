import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PasswordGeneratorForm from './password-generator-form';
import './add-password.css';

const FormHeading = ({ desc }) => {
	const styles = {
		margin: '0 0 20px 0',
		textTransform: 'uppercase',
		fontSize: '1.35em',
		paddingBottom: '5px',
		borderBottom: '3px solid #F11C64',
		color: '#F3F3F5',
		fontWeight: '300',
		letterSpacing: '1.5px',
	};
	return (
		<h1 style={styles}>{desc}</h1>
	);
};

const GenerateNewPasswordButton = ({ desc, onClick }) => {
	const styles = {
		border: 'none',
		background: 'inherit',
		color: '#EF5A40',
		letterSpacing: '1px',
		borderBottom: '1px solid #EF5A40',
		fontWeight: '300',
		cursor: 'pointer',
		fontSize: '.9em',
		padding: '0 5px',
	};
	return (
		<button type='button' style={styles} onClick={onClick}>
			{desc}
		</button>
	);
};

const TextInputField = (props) => {
	const { desc, name, placeholder, onChange, value, touched } = props;
	const styles = {
		label: {
			margin: '0px auto 35px auto',
			overflow: 'hidden',
			display: 'block',
		},
		span: {
			fontSize: '1em',
			color: '#F3F3F5',
			letterSpacing: '1.25px',
			display: 'inline-block',
		},
		input: {
			border: 'none',
			padding: '15px 15px 10px 15px',
			background: 'inherit',
			borderBottom: '3px solid #1F224A',
			width: '100%',
			letterSpacing: '1.25px',
			color: '#F3F3F5',
			fontSize: '.9em',
			fontWeight: '300',
		},
		invalid: { borderBottom: '3px solid #CC0000' },
		touched: { borderBottom: '3px solid #35D235' },
	};

	if (touched && value.length === 0) {
		styles.input = {...styles.input, ...styles.invalid };
	} else if (touched) {
		styles.input = {...styles.input, ...styles.touched };
	}

	return (
		<label style={styles.label}>
			<span style={styles.span}>{desc}</span>
			<input
				type="text"
				style={styles.input}
				name={name}
				placeholder={placeholder}
				onChange={onChange}
				value={value} />
		</label>
	);
};

class AddNewPassword extends Component {
	constructor() {
		super();
		this.state = {
			formFields: {
				name: { value: '', touched: false, isValid: false },
				username: { value: '', touched: false, isValid: false },
				password: { value: '', touched: false, isValid: false },
			},
			showPasswordGenerator: false,
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.togglePasswordGenerator = this.togglePasswordGenerator.bind(this);
		this.onPasswordGenerated = this.onPasswordGenerated.bind(this);
		this.checkIfValidForm = this.checkIfValidForm.bind(this);
	}

	handleChange(event) {
		const target = event.target;
		const { name, value } = target;

		const newStateOfInputField = {
			value: value,
			touched: true,
			isValid: value.length > 0,
		};

		this.setState({
			formFields: {...this.state.formFields, [name]: newStateOfInputField}
		});
	}

	checkIfValidForm() {
		const formFields = Object.keys(this.state.formFields);
		const validFields = [];

		formFields.forEach(inputField => {
			if (this.state.formFields[inputField].isValid) {
				validFields.push(inputField);
			}
		});

		return validFields.length === 3;
	}

	handleSubmit(event) {
		event.preventDefault();
		// TODO process the new password item
		console.log('submitted:', this.state.formFields);
	}

	togglePasswordGenerator() {
		this.setState({
			showPasswordGenerator: !this.state.showPasswordGenerator
		});
	}

	onPasswordGenerated(generatedPassword) {
		const { formFields } = this.state;
		this.setState({
			formFields: {...formFields, password: generatedPassword}
		});
	}

	getStyles() {
		return {
			def: {
				background: '#2D3665',
				width: '85%',
				margin: '0 auto',
				marginBottom: '20px',
				borderRadius: '7.5px',
				padding: '15px',
				maxHeight: '400px',
				transition: 'max-height 300ms ease-in-out',
				overflow: 'hidden',
				fontWeight: '300',
			},
			expanded: { maxHeight: '700px' },
		};
	}

	render() {
		const { formFields, showPasswordGenerator } = this.state;
		const { def, expanded } = this.getStyles();
		const styles = showPasswordGenerator ? {...def,...expanded } : def;
		const passGeneratorForm = 
			<PasswordGeneratorForm onGenerated={this.onPasswordGenerated} />;
		return (
			<div style={styles}>
				<FormHeading desc='Add New Password' />
				<form onSubmit={this.handleSubmit}>
					<TextInputField 
						desc='Name' 
						name='name' 
						placeholder='Gmail'
						onChange={this.handleChange}
						touched={formFields.name.touched}
						value={formFields.name.value} />
					<TextInputField 
						desc='Enter your username or email address' 
						name='username' 
						placeholder='example@gmail.com'
						onChange={this.handleChange}
						touched={formFields.username.touched}
						value={formFields.username.value} />
					<TextInputField 
						desc='Enter or create your password' 
						name='password' 
						placeholder='9Mc6k&}A2lIhTlo'
						onChange={this.handleChange}
						touched={formFields.password.touched}
						value={formFields.password.value} />
					<div style={{
						display: 'flex',
						justifyContent: 'space-between',
						margin: '25px auto'
					}}>
						<GenerateNewPasswordButton 
							desc='Generate New Password'
							onClick={this.togglePasswordGenerator} />
						<input 
							type="submit" 
							value="Create" 
							disabled={!this.checkIfValidForm()} />
					</div>
				</form>
				<ReactCSSTransitionGroup
					transitionName="pass-gen-transition"
					transitionEnterTimeout={200}
					transitionLeaveTimeout={300}>
					{this.state.showPasswordGenerator && passGeneratorForm}
				</ReactCSSTransitionGroup>
			</div>
		);
	}
}

export default AddNewPassword;