import { shuffle } from 'lodash';

const specialChars = [
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

function getRandomChar(charset) {
	const min = 0;
	const max = charset.length - 1;
	const pos = Math.floor(Math.random() * (max - min)) + min;

	return charset[pos];
}

function getRandomNum() {
	return Math.floor(Math.random() * 10);
}

/**
 * Password Generator Functions
 */

function generatePassword(recipe) {
	const { length, digits, symbols } = recipe;
	let password = '';

	if (digits >= length) {
		password = generate(length, length, 0);
	} else if (digits === 0 && symbols >= length) {
		password = generate(length, 0, length);
	} else {
		password = generate(length, digits, symbols);
	}

	return password;
}

function generate(length, numOfDigits = 0, numOfSpecChars = 0) {
	const tempArray = [];
	const numOfLetters = (length - numOfDigits) - numOfSpecChars;
	let password = '';

	for (let i = 0; i < numOfLetters; i++) {
		let letter = getRandomChar(letters);
		letter = (i % 3 === 0) ? letter.toUpperCase() : letter;
		tempArray.push(letter);
	}

	for (let i = 0; i < numOfDigits; i++) {
		tempArray.push(getRandomNum());
	}

	for (let i = 0; i < numOfSpecChars; i++) {
		tempArray.push(getRandomChar(specialChars));
	}

	password = shuffle(tempArray).join(' ').replace(/\s+/g, '');

	return password;
}

/**
 * ID Generator Functions
 */

function generateRandomID() {
	const length = 6;
	const middle = Math.floor(length / 2);
	let randomID = [];

	for (let i = 0; i < middle; i++) {
		randomID.push(getRandomChar(letters));
	}

	while (randomID.length < length) {
		const randomNum = getRandomNum();
		const duplicate = randomID.find(num => num === randomNum);

		if (duplicate === undefined) {
			randomID.push(randomNum);
		}
	}

	randomID = shuffle(randomID).join(' ').replace(/\s+/g, '');
	return randomID;
}

export { 
	generatePassword,
	generateRandomID 
};