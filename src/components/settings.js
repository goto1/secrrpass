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
		let valid = false;
		const touched = true;
		const value = event.target.value;
		const { onChange } = this.props;

		if (touched && value.length > 0) {
			valid = true;
		}

		this.setState({ value, valid, touched });
		onChange(value); // pass the value to the parent
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

class Form extends Component {
	constructor() {
		super();
		this.state = { username: '', password: '' };
		this.onInputFormChange = this.onInputFormChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(event) {
		event.preventDefault();
	}

	onInputFormChange(value) {
		// console.log(value);
		// this.setState({ })
		// TODO: figure out what is changing!
	}

	render() {
		return (
			<form className="ListItemForm ListItemFormExpanded" onSubmit={this.handleSubmit}>
				<TextInputField 
					placeholder="New username" 
					onChange={this.onInputFormChange} />
				<TextInputField 
					placeholder="Current password"
					onChange={this.onInputFormChange} />
				<input type="submit" value="Submit" />
			</form>
		);
	} 
}

const ListItemForm = ({ show }) => {
	const classes = show ? 'ListItemForm ListItemFormExpanded' : 'ListItemForm';
	return (
		<Form />
	);
};


class ListItem extends Component {
	constructor(props) {
		super(props);
		this.state = { showForm: false };
		this.toggleForm = this.toggleForm.bind(this);
	}

	toggleForm(event) {
		this.setState({ showForm: !this.state.showForm });
	}

	render() {
		const { showForm } = this.state;
		const { desc } = this.props;
		const form = <ListItemForm show={showForm} />;		
		return (
			<div className="ListItemWithForm">
				<div className="ListItem">
					<div className="desc">{desc}</div>
					<div>
						<i 
							className="fa fa-angle-down" 
							aria-hidden="true" 
							onClick={this.toggleForm} />
					</div>
				</div>
				{ showForm && form }
			</div>
		);
	}
}

class Settings extends Component {
	render() {
		return (
			<div className="Card">
				<h2 className="CardHeading">Settings</h2>
				<ListItem desc="Change Username" />
				<ListItem desc="Change Password" />
				<ListItem desc="Delete Account" />
			</div>
		);
	}
}

export default Settings;
