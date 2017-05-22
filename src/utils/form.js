import * as _ from 'lodash';

function formField(attributes, description) {
	if (!attributes || !description) { return null; }

	return {
		attr: { value: '', ...attributes },
		valid: false,
		touched: false,
		desc: description,
	};
}

function updateFormFields(event, formFields) {
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

function updateSliderValues(event, sliders) {
	const { name, value } = event;
	const updatedSlider = {...sliders[name], value};

	return {...sliders, [name]: updatedSlider};
}

function getPasswordRecipe(sliders) {
	const recipe = {};

	_.forEach(sliders, (value, key) => {
		recipe[key] = +value.value;
	});

	return recipe;
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

function resetForm(form) {
	if (!form) { return; }

	const formCopy = Object.assign({}, form);

	_.forEach(formCopy, (value, key) => {
		if (key === 'formFields') {
			const formFields = formCopy[key];

			_.forEach(formFields, (value, key) => {
				formFields[key].attr.value = '';
				formFields[key].touched = false;
				formFields[key].valid = false;
			});

			formCopy[key] = formFields;
		} else {
			formCopy[key] = false;
		}
	});

	return formCopy;
}

export {
	formField, 
	updateFormFields, 
	updateSliderValues,
	checkIfValidForm, 
	checkIfMatchingFields,
	resetForm,
	getPasswordRecipe
};