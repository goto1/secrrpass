import React, { Component } from 'react';
import CardLayout from '../layouts/card';
import InputField from '../views/input-field';

function formField(attributes, description) {
	return {
		attr: { value: '', ...attributes },
		valid: false,
		touched: false,
		desc: description,
	};
}

class EditPassword extends Component {
	constructor() {
		super();

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
		};

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit() { }

	handleChange(e) {
		const { name, value } = e.target;
		const formInput = Object.assign({}, this.state.formFields[name]);

		const updated = {
			...this.state.formFields,
			[name]: {
				...formInput,
				attr: { ...formInput.attr, value },
				valid: value.length > 0 ? true : false,
				touched: true,
			}
		};

		this.setState({ formFields: updated });
	}

	render() {
		const { name, username, password } = this.state.formFields;

		return (
			<CardLayout heading="Edit Password">
				<form onSubmit={this.handleSubmit}>
					<InputField {...name} />
					<InputField {...username} />
					<InputField {...password} />
				</form>
			</CardLayout>
		);
	}
}

export default EditPassword;