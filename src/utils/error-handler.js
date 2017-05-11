import firebase from './firebase';

const extractClassNameAndFunction = (stack) => {
	const classNameAndFunction = 
		stack.slice(stack.indexOf('at ') + 3, stack.indexOf('http') - 2);
	
	return classNameAndFunction;
};

const handleError = (err) => {
	const date = new Date();

	const error =  {
		location: extractClassNameAndFunction(err.stack),
		message: err.message || 'N/A',
		name: err.name || 'N/A',
		date: date.toLocaleDateString(),
		time: date.toLocaleTimeString(),
	};

	firebase.logError(error);
};

export { handleError };