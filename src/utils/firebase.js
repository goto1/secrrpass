/* eslint-disable */

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

const checkIfValidPasswordID = (passwordID) => {
	let valid = false;

	if (passwordID && typeof passwordID === 'string' && passwordID.length === 20) {
		valid = true;
	}

	return valid;
};

const updateUserLastAccess = (userID) => {
	if (!checkIfValidUserID(userID)) {
		return new Promise((resolve, reject) => {
			reject('Invalid UserID');
		});
	}

	const updates = {
		[`/users/${userID}/lastAccess`]: Date.now(),
	};

	firebase.database().ref().update(updates);
};

const checkIfUserExists = (userID) => {
	if (!checkIfValidUserID(userID)) { 
		return new Promise((resolve, reject) => {
			reject('Invalid UserID');
		});
	}

	return firebase.database().ref(`/users/${userID}`).once('value');
}

const	createNewUser = (userID) => {
	if (!checkIfValidUserID(userID)) { return; }

	firebase.database().ref(`/users/${userID}`).set({
		passwords: {},
		firstAccess: Date.now(),
		lastAccess: Date.now(),
	});
};

const deleteUser = (userID) => {
	if (!checkIfValidUserID(userID)) { return; }

	firebase.database().ref(`/users/${userID}`).remove();
};

const createNewPassword = (userID, passwordDetails) => {
	if (!checkIfValidUserID(userID) || !passwordDetails) { 
		return; 
	}

	const password = {
		serviceName: passwordDetails.serviceName,
		userName: passwordDetails.userName,
		password: passwordDetails.password,
		createdAt: Date.now(),
		updatedAt: Date.now(),
	};

	const passwordID = firebase.database().ref().child('passwords').push().key;
	const updates = {};
	updates[`/users/${userID}/passwords/${passwordID}`] = password;

	updateUserLastAccess(userID);

	firebase.database().ref().update(updates);
};

const getAllPasswords = (userID) => {
	if (!checkIfValidUserID) {
		return new Promise((resolve, reject) => {
			reject('Invalid UserID');
		});
	}
	updateUserLastAccess(userID);

	return firebase.database().ref(`/users/${userID}/passwords`).once('value');
}

const editPassword = (userID, passwordID, updatedPasswordDetails) => {
	if (!checkIfValidUserID(userID) || !checkIfValidPasswordID(passwordID)) {
		return new Promise((resolve, reject) => {
			reject('Invalid UserID and/or PasswordID');
		});
	}

	const updates = {};
	updates[`/users/${userID}/passwords/${passwordID}`] = updatedPasswordDetails;
	
	updateUserLastAccess(userID);

	firebase.database().ref().update(updates);
};

const deletePassword = (userID, passwordID) => {
	if (!checkIfValidUserID(userID) || !checkIfValidPasswordID(passwordID)) {
		return;
	}

	firebase.database().ref(`/users/${userID}/passwords/${passwordID}`).remove();
};

export default {
	checkIfUserExists,
	createNewUser,
	deleteUser,
	createNewPassword,
	editPassword,
	deletePassword,
	getAllPasswords,
};