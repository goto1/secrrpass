/**
 * Form utilities
 */

// Checks if form is valid
const checkIfFormValid = (formFields) => {
	const formFieldTypes = Object.keys(formFields);
	const validInputFields = formFieldTypes.filter(name => formFields[name].valid);

	return formFieldTypes.length === validInputFields.length;
};

const formUtils = {
	checkIfFormValid,
};

export default formUtils;