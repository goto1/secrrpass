import * as _ from 'lodash';
import randGenerator from './random-generator';

const { letters, getRandomCharFrom, generateRandomNum } = randGenerator;

const generateRandomID = () => {
	let randomID = [];
	const length = 6;
	const middle = Math.floor(length / 2);

	for (let i = 0; i < middle; i++) {
		randomID.push(getRandomCharFrom(letters));
	}

	while (randomID.length < length) {
		const generatedNum = generateRandomNum();
		const duplicate = randomID.find(num => num === generatedNum);

		if (duplicate === undefined) {
			randomID.push(generatedNum);
		}
	}

	randomID = _.shuffle(randomID).join(' ').replace(/\s+/g, '');

	return randomID;
};

export default generateRandomID;