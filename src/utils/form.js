import * as _ from 'lodash';

function formField(attributes, description) {
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
	const isValid = _.reduce(formFields,
		(result, value) => result && value.valid, true);

	return isValid;
}

function checkIfMatchingFields(field1, field2) {
	return field1.value === field2.value;
}

export {
	formField, 
	updateFormField, 
	checkIfValidForm, 
	checkIfMatchingFields 
};