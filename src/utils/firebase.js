import * as firebase from 'firebase';
import config from '../config/firebase';

firebase.initializeApp(config);

const checkIfValidUserID = (userID) => {
	let valid = false;

	if (userID && typeof userID === 'string' && userID.length === 6) {
		valid = true;
	}

	return valid;
}

const checkIfUserExists = (userID) => {
	const validUserID = checkIfValidUserID(userID);

	if (!validUserID) {
		return new Promise((resolve, reject) => {
			reject('Invalid UserID')
		});
	}

	return firebase.database().ref(`/users/${userID}`).once('value');
}

const	createNewUser = (userID) => {
	const validUserID = checkIfValidUserID(userID);

	if (!validUserID) {
		return;
	}

	firebase.database().ref(`users/${userID}`).set({
		passwords: [],
		firstAccess: Date.now(),
		lastAccess: Date.now(),
	});
};

const createNewPassword = (userID, serviceName, userName, password) => {
	const newPassword = {
		serviceName: serviceName,
		username: userName,
		password: password,
		createdAt: Date.now(),
		updatedAt: Date.now(),
	};

	const newPasswordKey = firebase.database().ref().child('passwords').push().key;

	var updates = {};
	// updates[]
}

//

export default {
	checkIfUserExists,
	createNewUser,
};


// const database = {
// 	users: {
// 		'j49jf': {
// 			passwords: ['1234', '5678'],
// 			lastAccess: Date.now(),
// 		}
// 	}
// 	passwords: {
// 		'1234': {
// 			serviceName: '',
// 			userName: '',
// 			password: '',
// 			createdAt: Date.now(),
// 			updatedAt: Date.now(),
// 		},
// 	},
// }