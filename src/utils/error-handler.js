import API from './api';

function extractClassNameAndFunction(stack) {
	let classNameAndFunction = '';

	try {
		classNameAndFunction = stack.slice(stack.indexOf('at ') + 3, stack.indexOf('http') - 2);
	} catch (e) {
		classNameAndFunction = 'N/A';
	}

	return classNameAndFunction;
}

function handleError(err) {
	if (Object.getPrototypeOf(err).name !== 'Error') { return; }

	const date = new Date();
	const error = {
		location: extractClassNameAndFunction(err.stack),
		message: err.message || 'N/A',
		name: err.name || 'N/A',
		date: date.toLocaleDateString(),
		time: date.toLocaleTimeString(),
	};

	API.logError(error)
}

export default { log: handleError };