import React from 'react';
import PasswordItem from '../containers/password-item';

const dummyPasswords = [
	{ id: 1, name: 'Yahoo', username: 'jsmith@yahoo.com' },
	{ id: 2, name: 'Google', username: 'johnny@gmail.com' },
	{ id: 3, name: 'Amazon', username: 'drpepper@gmail.com' },
	{ id: 4, name: 'Apple', username: 'willywonka@aol.com' },
	{ id: 5, name: 'AT&T', username: 'jsmith@gmail.com' },
	{ id: 6, name: 'Bank of America', username: 'jsmith39993' },
	{ id: 7, name: 'Wells Fargo', username: 'jw4888' },
	{ id: 8, name: 'Capital One', username: 'jsmithcap2' },
];

const passListStyle = { };

export default (props) => {
	const passwords = dummyPasswords.map((password, index) => 
		<PasswordItem
			key={password.id.toString()}
			name={password.name}
			login={password.username} />
	);
	return (
		<div style={passListStyle}>
			{passwords}
		</div>
	);		
};