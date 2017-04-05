import React, { Component } from 'react';
import * as _ from 'lodash';
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
		this.generateNewPassword = this.generateNewPassword.bind(this);
	}

	generateNewPassword() {
		const specialCharacters = [
			']', '[', '?', '/',
			'<', '~', '#', '`',
			'!', '@', '$', '%', 
			'^', '&', '*', '(',
			')', '+', '=', '}',
			'|', ':', '"', ';',
			'_', '.', '>', '{'
		];
		const letters = [
			'a', 'b', 'c', 'd',
			'e', 'f', 'g', 'h',
			'i', 'j', 'k', 'l',
			'm', 'n', 'o', 'p',
			'r', 's', 't', 'u',
			'w', 'z'
		];

		const getRandomCharacter = (characterSet) => {
			const min = 0;
			const max = characterSet.length - 1;
			const position = Math.floor(Math.random() * (max - min)) + min;

			return characterSet[position];
		};

		const generatePassword = 
			(length, numOfNumbers = 0, numOfSpecChars = 0) => {
				let password = '';
				let tempArray = [];
				const numOfLetters = (length - numOfNumbers) - numOfSpecChars;

				for (let i = 0; i < numOfLetters; i++) {
					let randomLetter = getRandomCharacter(letters);
					randomLetter = (i % 3 === 0) ? randomLetter.toUpperCase() : randomLetter;
					tempArray.push(randomLetter);
				}

				for (let i = 0; i < numOfNumbers; i++) {
					const randomNumber = Math.floor(Math.random() * 10);
					tempArray.push(randomNumber.toString());
				}

				for (let i = 0; i < numOfSpecChars; i++) {
					tempArray.push(getRandomCharacter(specialCharacters));
				}

				tempArray = _.shuffle(tempArray);
				password = tempArray.join(' ').replace(/\s+/g, '');

				return password;
			}

		console.log(generatePassword(25));
		console.log(generatePassword(20, 8, 5));
		console.log(generatePassword(50, 12, 12));
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
						<button 
							type="button"
							onClick={this.generateNewPassword}>
							Generate New Password
						</button>
						<input type="submit" value="Create" />
					</div>
				</form>
			</div>
		);
	}
}

export default AddPasswordForm;