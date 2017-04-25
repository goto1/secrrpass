import * as _ from 'lodash';

const checkIfFormValid = (formFields) => {
	const isValid = _.reduce(formFields, 
		(result, value) => result && value.valid, true);

	return isValid;
};

const formUtils = {
	checkIfFormValid,
};

export default formUtils;