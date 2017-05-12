import React from 'react';
import './input-field.css';

function InputField({ attr, desc, valid, touched }) {
	const styles = {};

	if (touched && !valid) {
		styles.borderBottomColor = '#CC0000';
	} else if (touched) {
		styles.borderBottomColor = '#35D235';
	}

	return (
		<div className="InputField">
			<label>
				<span>{desc}</span>
				<input {...attr} style={styles} />
			</label>
		</div>
	);
}

export default InputField;


