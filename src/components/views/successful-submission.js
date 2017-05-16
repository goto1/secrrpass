import React from 'react';
import { genDefaultBtn } from '../../utils/form';

function SuccessfulSubmission({ message, actionName, action }) {
	const styles = {
		container: {
			textAlign: 'center',
			marginTop: '25%',
			padding: '20px',
			fontWeight: '200',
			letterSpacing: '2px',
			lineHeight: '35px',
		},
		message: {
			margin: '30px 0',
			fontSize: '22.5px',
			textTransform: 'uppercase',
			color: '#F3F4F5'
		},
		button: {
			display: 'flex',
			justifyContent: 'space-between',
			margin: '25px auto',
		},
	};
	const button = genDefaultBtn(actionName, action);

	return (
		<div style={styles.container}>
			<div style={styles.message}>
				<div>{message}</div>
			</div>
			<div style={styles.message}>
				{ button }
			</div>
		</div>
	);
}

export default SuccessfulSubmission;