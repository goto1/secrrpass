import React from 'react';
import './input-field.css';

function InputField({ desc, attr }) {
	return (
		<div className="InputField">
			<label>
				<span>{desc}</span>
				<input {...attr} />
			</label>
		</div>
	);
}

export default InputField;