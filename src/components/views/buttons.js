import React from 'react';
import './buttons.css';

function SubmitButton({ attr, name }) {
	return (
		<button className='btn-submit' type='submit' {...attr}>
			{name}
		</button>
	);
}

function DefaultButton({ name, attr }) {
	return (
		<button className='btn-default' type='button' {...attr}>
			{name}
		</button>
	);
}

export {
	SubmitButton,
	DefaultButton,
};