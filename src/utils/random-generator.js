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

const getRandomCharFrom = (charSet) => {
	const min = 0;
	const max = charSet.length - 1;
	const pos = Math.floor(Math.random() * (max - min)) + min;

	return charSet[pos];
};

const genRandomNum = () => Math.floor(Math.random() * 10);

export default {
	specialChars,
	letters,
	getRandomCharFrom,
	genRandomNum,
};