/* eslint-disable */

import * as firebase from 'firebase';
import config from '../config/firebase';

firebase.initializeApp(config);

const checkIfValidUserID = (userID) => {
	const isValid = 
		(typeof userID === 'string' && userID.length === 6) ? true : false;

	return isValid;
}

const checkIfValidPasswordID = (passwordID) => {
	const isValid =
		(typeof passwordID === 'string' && passwordID.length === 20) ? true : false;

	return isValid;
};

const updateUserLastAccess = (userID) => {
	if (!checkIfValidUserID) {
		return new Promise.reject('Invalid UserID');
	}

	const updates = {
		[`/users/${userID}/lastAccess`]: Date.now(),
	};

	firebase.database().ref().update(updates);
};

const checkIfUserExists = (userID) => {
	if (!checkIfValidUserID) {
		return new Promise.reject('Invalid UserID');
	}

	return firebase.database().ref(`/users/${userID}`).once('value');
};

const getUserReference =
	(userID) => firebase.database().ref(`/users/${userID}`);

const getPassReference =
	(userID, passwordID) => firebase.database().ref(`/users/${userID}/passwords/${passwordID}`);

const getMasterPassReference =
	(userID) => firebase.database().ref(`/users/${userID}/masterPassword`);

const createNewUser = (userID) => {
	if (!checkIfValidUserID(userID)) { return; }

	const userRef = getUserReference(userID);

	userRef.set({
		firstAccess: Date.now(),
		lastAccess: Date.now(),
	});
};

const deleteUser = (userID) => {
	if (!checkIfValidUserID(userID)) { return; }

	const userRef = getUserReference(userID);

	userRef.remove();
};

const createNewPassword = (userID, password) => {
	if (!checkIfValidUserID(userID) || !password) { return; }
	updateUserLastAccess(userID);

	const passwordID = firebase.database().ref().child('passwords').push().key;
	const passRef = getPassReference(userID, passwordID);

	passRef.set({
		serviceName: password.serviceName || '',
		userName: password.userName || '',
		password: password.password || '',
		createdAt: Date.now(),
		updatedAt: Date.now(),
	});
};

const getAllPasswords = (userID) => {
	if (!checkIfValidUserID) {
		return new Promise.reject('Invalid UserID');
	}
	updateUserLastAccess(userID);

	const passwordsRef = 
		firebase.database().ref(`/users/${userID}/passwords`);

	return passwordsRef.once('value');
}

const editPassword = (userID, passwordID, updatedPassword) => {
	if (!checkIfValidUserID(userID) || !checkIfValidPasswordID(passwordID)) {
		return new Promise((resolve, reject) => {
			reject('Invalid UserID and/or PasswordID');
		});
	}
	updateUserLastAccess(userID);

	const updates = {
		[`/users/${userID}/passwords/${passwordID}`]: updatedPassword,
	};

	firebase.database().ref().update(updates);
};

const deletePassword = (userID, passwordID) => {
	if (!checkIfValidUserID(userID) || !checkIfValidPasswordID(passwordID)) {
		return;
	}
	updateUserLastAccess(userID);

	const passRef = getPassReference(userID, passwordID);

	passRef.remove();
};

const setMasterPassword = (userID, masterPassword) => {
	if (!checkIfValidUserID(userID) || !masterPassword) { return; }
	updateUserLastAccess(userID);

	const masterPassRef = firebase.database().ref(`/users/${userID}/masterPassword`);

	masterPassRef.set(masterPassword);
};

const checkIfMasterPasswordSet = (userID) => {
	if (!checkIfValidUserID) {
		return new Promise.reject('Invalid UserID');
	}
	updateUserLastAccess(userID);

	const masterPassRef = getMasterPassReference(userID);

	return masterPassRef.once('value');
};

export default {
	checkIfUserExists,
	createNewUser,
	deleteUser,
	setMasterPassword,
	checkIfMasterPasswordSet,
	createNewPassword,
	editPassword,
	deletePassword,
	getAllPasswords,
};