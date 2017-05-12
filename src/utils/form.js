import * as _ from 'lodash';

function formField(attributes, description) {
	if (!attributes || !description) { return {}; }

	return {
		attr: { value: '', ...attributes },
		valid: false,
		touched: false,
		desc: description,
	};
}

function updateFormField(event, formFields) {
	if (!event || !formFields) { return {}; }

	const { name, value } = event.target;
	const formField = Object.assign({}, formFields[name]);

	const updated = {
		...formFields,
		[name]: {
			...formField,
			attr: { ...formField.attr, value },
			valid: value.length > 0 ? true : false,
			touched: true,
		},
	};

	return updated;
}

function checkIfValidForm(formFields) {
	if (!formFields) { return false; }

	const isValid = _.reduce(formFields,
		(result, value) => result && value.valid, true);

	return isValid;
}

function checkIfMatchingFields(field1, field2) {
	if (!field1 || !field2) { return false; }

	return field1.value === field2.value;
}

export {
	formField, 
	updateFormField, 
	checkIfValidForm, 
	checkIfMatchingFields 
};