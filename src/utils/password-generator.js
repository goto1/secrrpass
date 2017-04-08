import * as _ from 'lodash';

export default {
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
	generateNewPasswordWith(recipe) {
		let password = '';
		const { length, digits, symbols } = recipe;

		if (digits >= length) {
			password = this.generate(length, length, 0);
		} else if (digits === 0 && symbols >= length) {
			password = this.generate(length, 0, length);
		} else {
			password = this.generate(length, digits, symbols);
		}

		return password;
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
	},
};