import React, { Component } from 'react';
import './add-password.css';

const styles = {
	background: '#2D3665',
	width: '85%',
	margin: '0 auto',
	borderRadius: '7.5px',
	padding: '15px',
}

class AddPasswordForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			serviceName: '',
			username: '',
			password: '',
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		this.setState({ [name]: value });
	}

	handleSubmit(event) {
		event.preventDefault();
		console.log('submitted:', this.state);
	}

	render() {
		return (
			<div style={styles}>
				<h1>Add New Password</h1>
				<form onSubmit={this.handleSubmit}>
					<label>
						<span>Name</span>
						<input 
							name="serviceName"
							type="text" 
							placeholder="Gmail" 
							onChange={this.handleChange}
							value={this.state.name} />
					</label>
					<label>
						<span>Enter your username or email address</span>
						<input 
							name="username"
							type="text" 
							placeholder="example@gmail.com" 
							onChange={this.handleChange}
							value={this.state.username} />
					</label>
					<label>
						<span>Enter or create your password</span>
						<input 
							name="password"
							type="password" 
							placeholder="********" 
							onChange={this.handleChange}
							value={this.state.password} />
					</label>
					<div>
						<button type="button">Generate New Password</button>
						<input type="submit" value="Create" />
					</div>
				</form>
			</div>
		);
	}
}

export default AddPasswordForm;