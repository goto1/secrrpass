import API from './api';

// ErrorHandler.log({
// 	err: new Error('Error'),
// 	location: 'error-handler.js:10',
// });

function handleError({ err, location }) {
	if (Object.getPrototypeOf(err).name !== 'Error' || !location) {
		return;
	}

	const date = new Date();
	const error = {
		location: location,
		message: err.message,
		name: err.name || 'N/A',
		date: date.toLocaleDateString(),
		time: date.toLocaleTimeString(),
	};

	API.logError(error);
}

export default { log: handleError };