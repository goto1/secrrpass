import React, { Component } from 'react';
import * as _ from 'lodash';
import './add-password.css';

const passwordGenerator = {
	specialCharacters: [
		']', '[', '?', '/',
		'<', '~', '#', '`',
		'!', '@', '$', '%', 
		'^', '&', '*', '(',
		')', '+', '=', '}',
		'|', ':', '"', ';',
		'_', '.', '>', '{'
	],

	letters: [
		'a', 'b', 'c', 'd',
		'e', 'f', 'g', 'h',
		'i', 'j', 'k', 'l',
		'm', 'n', 'o', 'p',
		'r', 's', 't', 'u',
		'w', 'z'
	],

	getRandomCharacter(characterSet) {
		const min = 0;
		const max = characterSet.length - 1;
		const position = Math.floor(Math.random() * (max - min)) + min;

		return characterSet[position];
	},

	generate(length, numOfNumbers = 0, numOfSpecChars = 0) {
		let password = '';
		let tempArray = [];
		const numOfLetters = (length - numOfNumbers) - numOfSpecChars;

		for (let i = 0; i < numOfLetters; i++) {
			let randomLetter = this.getRandomCharacter(this.letters);
			randomLetter = (i % 3 === 0) ? randomLetter.toUpperCase() : randomLetter;
			tempArray.push(randomLetter);
		}

		for (let i = 0; i < numOfNumbers; i++) {
			const randomNumber = Math.floor(Math.random() * 10);
			tempArray.push(randomNumber.toString());
		}

		for (let i = 0; i < numOfSpecChars; i++) {
			tempArray.push(this.getRandomCharacter(this.specialCharacters));
		}

		tempArray = tempArray.slice(0, length);
		tempArray = _.shuffle(tempArray);
		password = tempArray.join(' ').replace(/\s+/g, '');

		return password;
	}

}

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
						<button 
							type="button"
							onClick={this.generateNewPassword}>
							Generate New Password
						</button>
						<input type="submit" value="Create" />
					</div>
				</form>
				<GenerateNewPassword />

			</div>
		);
	}
}

class GenerateNewPassword extends Component {
	constructor(props) {
		super(props);
		this.state = {
			length: 15,
			digits: 3,
			symbols: 2,
		};
		this.handleChange = this.handleChange.bind(this);
		this.generatePassword = this.generatePassword.bind(this);
	}

	componentWillMount() {
		// Generate a new password
		this.generatePassword(this.state);
	}

	handleChange(event) {
		const target = event.target;
		const value = +target.value;
		const name = target.name;

		this.setState((prevState, currProps) => {
			const newState = {...prevState, [name]: value};
			this.generatePassword(newState);
			return newState;
		});
	}

	generatePassword(receipt) {
		let password = '';
		const { length, digits, symbols } = receipt;

		if (digits >= length) {
			password = passwordGenerator.generate(length, length, 0);
		} else if (digits === 0 && symbols >= length) {
			password = passwordGenerator.generate(length, 0, length);
		} else {
			password = passwordGenerator.generate(length, digits, symbols);
		}

		console.log(password);
	}

	render() {
		return (
			<div className="passwordGenerator">
				<div className="slider">
					<div className="name">Length</div>
					<input 
						type="range" 
						min="0" 
						max="64"
						name="length"
						value={this.state.length}
						onChange={this.handleChange} />
					<div className="count">{this.state.length}</div>
				</div>
				<div className="slider">
					<div className="name">Digits</div>
					<input 
						type="range" 
						min="0" 
						max="10" 
						name="digits"
						value={this.state.digits}
						onChange={this.handleChange} />
					<div className="count">{this.state.digits}</div>
				</div>
				<div className="slider">
					<div className="name">Symbols</div>
					<input 
						type="range" 
						min="0" 
						max="10"
						name="symbols"
						value={this.state.symbols}
						onChange={this.handleChange} />
					<div className="count">{this.state.symbols}</div>
				</div>
			</div>
		);
	}
}


export default AddPasswordForm;