import React, { Component } from 'react';
import PasswordItem from '../containers/password-item';
import generateRandomID from '../../utils/id-generator';

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

class PasswordList extends Component {

	componentWillMount() {
		const { match, history } = this.props;
		const userID = match.params.userID || '';

		if (!userID) {
			history.push(`/${generateRandomID()}`);
		}

		localStorage.setItem('userID', userID);
	}

	render() {
		const listOfPasswords = dummyPasswords.map((password, index) => {
			const details = {
				key: password.id.toString(),
				id: password.id,
				password: password,
			};
			return <PasswordItem {...details} />;
		});

		return <div>{listOfPasswords}</div>;
	}
}

export default PasswordList;