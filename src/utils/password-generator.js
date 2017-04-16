import * as _ from 'lodash';
import randGenerator from './random-generator';

const { specialChars, letters, getRandomCharFrom, generateRandomNum } = randGenerator;

const passwordGenerator = {
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
		const tempArray = [];
		const numOfLetters = (length - numOfNumbers) - numOfSpecChars;

		for (let i = 0; i < numOfLetters; i++) {
			let letter = getRandomCharFrom(letters);
			letter = (i % 3 === 0) ? letter.toUpperCase() : letter;
			tempArray.push(letter);
		}

		for (let i = 0; i < numOfNumbers; i++) {
			tempArray.push(generateRandomNum());
		}

		for (let i = 0; i < numOfSpecChars; i++) {
			tempArray.push(getRandomCharFrom(specialChars));
		}

		password = _.shuffle(tempArray).join(' ').replace(/\s+/g, '');

		return password;
	}
};

export default passwordGenerator;