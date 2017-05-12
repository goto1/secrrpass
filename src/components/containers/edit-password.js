import React, { Component } from 'react';
import CardLayout from '../layouts/card';
import InputField from '../views/input-field';
import { formField, updateFormField } from '../../utils/form';

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

	handleChange(event) {
		const updatedFormFields = updateFormField(event, this.state.formFields);

		this.setState({ formFields: updatedFormFields });
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