import React, { Component } from 'react';
import PasswordItem from '../containers/password-item';
import Loader from '../views/loader';
import firebase from '../../utils/firebase';
import securityUtils from '../../utils/security-utils';
import './password-list.css';

const NoPasswordsToShow = () => (
	<div className="NoPasswordsToShow">
		<div><i className="fa fa-frown-o" aria-hidden='true' /></div>
		<div>
			<span>Currently you do not have any saved passwords.</span>
			<span>Go ahead and a few passwords for future reference!</span>
		</div>
	</div>
);

class PasswordList extends Component {
	constructor() {
		super();
		this.state = { passwords: [] };
	}

	componentDidMount() {
		const userID = localStorage.getItem('userID');

		const extractData = (data) => data.val();
		const decryptData = (data) => {
			if (data) {
				return Object.keys(data).map((id) => {
					const decrypted = securityUtils.decrypt(data[id]);
					return { id, ...decrypted };
				});
			}
			return data;
		};

		firebase.getUserPasswords(userID)
			.map(extractData)
			.map(decryptData)
			.subscribe(
				(passwords) => { this.setState({ passwords }); },
				(err) => { console.log(err); }
			);
	}

	render() {
		let passwordList = null;

		if (this.state.passwords) {
			passwordList = this.state.passwords.map(
				password => <PasswordItem key={password.id} {...password} />
			);
		}

		return (
			<div className="PasswordList">
				{ passwordList && <Loader /> }

				{ passwordList ? (
					passwordList
				) : (
					<NoPasswordsToShow />
				) }
			</div>
		);
	}
}

// const dummyPasswords = [
// 	{ id: 1, name: 'Yahoo', username: 'jsmith@yahoo.com' },
// 	{ id: 2, name: 'Google', username: 'johnny@gmail.com' },
// 	{ id: 3, name: 'Amazon', username: 'drpepper@gmail.com' },
// 	{ id: 4, name: 'Apple', username: 'willywonka@aol.com' },
// 	{ id: 5, name: 'AT&T', username: 'jsmith@gmail.com' },
// 	{ id: 6, name: 'Bank of America', username: 'jsmith39993' },
// 	{ id: 7, name: 'Wells Fargo', username: 'jw4888' },
// 	{ id: 8, name: 'Capital One', username: 'jsmithcap2' },
// ];

// class PasswordList extends Component {

// 	// componentWillMount() {
// 	// 	const { match, history } = this.props;
// 	// 	const userID = match.params.userID || '';

// 	// 	if (!userID) {
// 	// 		history.push(`/${generateRandomID()}`);
// 	// 	}

// 	// 	localStorage.setItem('userID', userID);
// 	// }

// 	// componentDidMount() {
// 	// 	const userID = localStorage.getItem('userID');

// 	// 	// If user doesn't exist, create a new user
// 	// 	firebase.checkIfUserExists(userID)
// 	// 		.then((user) => {
// 	// 			if (user.val() === null) {
// 	// 				firebase.createNewUser(userID);
// 	// 			}
// 	// 		})
// 	// 		.catch((err) => { /* TODO: error handling */ });

// 	// 	// Delete a user with specified ID
// 	// 	// firebase.deleteUser(userID);
			
// 	// 	// Create a new password
// 	// 	// const pass = {
// 	// 	// 	serviceName: 'Google',
// 	// 	// 	userName: 'johnny@gmail.com',
// 	// 	// 	password: '9dp=ff2ff2f21wDAf)k',
// 	// 	// };
// 	// 	// firebase.createNewPassword(userID, pass);
		
// 	// 	// Get all user's passwords
// 	// 	// firebase.getAllPasswords(userID)
// 	// 	// 	.then((snapshot) => {
// 	// 	// 		const userPasswords = snapshot.val();
// 	// 	// 		const passwordIDs = Object.keys(userPasswords);
				
// 	// 	// 		const decryptedPasswords = passwordIDs.map((id) => {
// 	// 	// 			const details = sjcl.decrypt(secret.key, userPasswords[id]);
// 	// 	// 			return { id, ...JSON.parse(details) };
// 	// 	// 		});

// 	// 	// 		// Update a password
// 	// 	// 		// const passwordID = decryptedPasswords[0].id;
// 	// 	// 		// const updated = Object.assign({}, decryptedPasswords[0], {
// 	// 	// 		// 	userName: 'willywonka@aol.com',
// 	// 	// 		// 	password: 'CU[ca9Ui7Rir4B',
// 	// 	// 		// 	updatedAt: Date.now(),
// 	// 	// 		// });
// 	// 	// 		// _.unset(updated, 'id');

// 	// 	// 		// firebase.editPassword(userID, passwordID, updated);
// 	// 	// 	})
// 	// 	// 	.catch((err) => { console.log(err) });
		
// 	// 	// Set master password: CiimiOm^~9r6DL1
// 	// 	// firebase.setMasterPassword(userID, 'CiimiOm^~9r6DL1d');
		
// 	// 	// Check if master password is set
// 	// 	// firebase.checkIfMasterPasswordIsSet(userID)
// 	// 	// 	.then((snapshot) => {
// 	// 	// 		const masterPassword = snapshot.val();
// 	// 	// 	})
// 	// 	// 	.catch((err) => { console.log(err); });
		
// 	// 	// Check if master password is valid
// 	// 	// firebase.checkIfMasterPasswordIsValid(userID, 'CiimiOm^~9r6DL1dd');
// 	// }

// 	render() {
// 		const listOfPasswords = dummyPasswords.map((password, index) => {
// 			const details = {
// 				key: password.id.toString(),
// 				id: password.id,
// 				password: password,
// 			};
// 			return <PasswordItem {...details} />;
// 		});

// 		return <div>{listOfPasswords}</div>;
// 	}
// }

export default PasswordList;