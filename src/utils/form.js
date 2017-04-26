import * as _ from 'lodash';

const checkIfFormValid = (formFields) => {
	const isValid = _.reduce(formFields, 
		(result, value) => result && value.valid, true);

	return isValid;
};

const checkIfFieldsMatching = (field1, field2) => field1.value === field2.value;

const formUtils = {
	checkIfFormValid,
	checkIfFieldsMatching,
};

export default formUtils;