import * as _ from 'lodash';
import randGenerator from './random-generator';

const { letters, getRandomCharFrom, genRandomNum } = randGenerator;

const genRandomID = () => {
	const length = 6;
	const middle = Math.floor(length / 2);
	let randomID = [];

	for (let i = 0; i < middle; i++) {
		randomID.push(getRandomCharFrom(letters));
	}

	while (randomID.length < length) {
		const generatedNum = genRandomNum();
		const duplicate = randomID.find(num => num === generatedNum);
		if (duplicate === undefined) {
			randomID.push(generatedNum);
		}
	}

	randomID = _.shuffle(randomID);
	randomID = randomID.join(' ').replace(/\s+/g, '');

	return randomID;
};

export default genRandomID;