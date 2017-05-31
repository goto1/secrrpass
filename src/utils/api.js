import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import secret from '../config/secret';
import { extractData, decryptUserPasswords } from './response-handler';
import { getUserID, logout } from './user';
import { 
	encrypt, decrypt, 
	generatePasswordHash, compareHashToPassword } from './security';

firebase.initializeApp(decrypt(secret.firebase));

/**
 * User Functions
 */

function getUserReference(userID) {
	return firebase.database().ref(`/users/${userID}`);
}

function checkIfValidUserID(userID) {
	const regex = /^\w{6}$/;
	const valid = (typeof userID === 'string' && regex.test(userID)) ? true : false;

	return valid;
}

function checkIfUserExists() {
	const userID = getUserID();

	if (!checkIfValidUserID(userID)) {
		throw new Error(`Invalid UserID`);
	}

	const userRef = getUserReference(userID);

	return userRef.once('value').then(extractData);
}

function updateUserLastAccess(userID) {
	if (!checkIfValidUserID(userID)) {
		return Observable.throw(new Error('Invalid UserID'));
	}

	const lsRef = firebase.database().ref(`/users/${userID}/lastAccess`);

	return Observable.fromPromise(lsRef.set(Date.now()));
}

function createUser() {
	const userID = getUserID();

	if (!checkIfValidUserID(userID)) {
		throw new Error(`Invalid UserID`);
	}

	const userRef = getUserReference(userID);
	const access = { firstAccess: Date.now(), lastAccess: Date.now() };

	return userRef.set(access);
}

function deleteUser() {
	const userID = getUserID();

	if (!checkIfValidUserID(userID)) {
		throw new Error(`Invalid UserID`);
	}

	logout();

	const userRef = getUserReference(userID);

	return userRef.remove();
}

/**
 * Password Functions
 */

function checkIfValidPasswordID(id) {
	return (typeof id === 'string' && id.length === 20) ? true : false;
}

function getPasswordReference(userID, passwordID) {
	return firebase.database().ref(`/users/${userID}/passwords/${passwordID}`);
}

function getMasterPasswordReference(userID) {
	return firebase.database().ref(`/users/${userID}/masterPassword`);
}

function createNewPassword(userID, passwordInfo) {
	if (!checkIfValidUserID(userID) || !passwordInfo) {
		return Observable.throw(new Error('Invalid UserID and/or Missing Password Info'));
	}

	const passID = firebase.database().ref().child('passwords').push().key;
	const passRef = getPasswordReference(userID, passID);
	const password = {
		serviceName: passwordInfo.serviceName,
		userName: passwordInfo.userName,
		password: passwordInfo.password,
		createdAt: Date.now(),
		updatedAt: Date.now(),
	};
	const encrypted = encrypt(password);

	return Observable.fromPromise(passRef.set(encrypted))
		.debounceTime(1000);
}

function getPasswords() {
	const userID = getUserID();

	if (!checkIfValidUserID(userID)) {
		throw new Error('Invalid UserID');
	}

	const passwordsRef = 
		firebase.database().ref(`/users/${userID}/passwords`);

	return passwordsRef.once('value')
		.then(extractData)
		.then(decryptUserPasswords);
}

function getPasswordDetails(userID, passwordID) {
	if (!checkIfValidUserID(userID) || !checkIfValidPasswordID(passwordID)) {
		return Observable.throw(new Error('Invalid UserID and/or PasswordID'));
	}
	updateUserLastAccess(userID);

	const passRef = getPasswordReference(userID, passwordID);

	return Observable.fromPromise(passRef.once('value'))
		.map(extractData)
		.map(decrypt);
}

function deletePassword(passID) {
	const userID = getUserID();

	if (!checkIfValidUserID(userID) || !checkIfValidPasswordID(passID)) {
		throw new Error('Invalid UserID and/or PasswordID');
	}

	const passRef = getPasswordReference(userID, passID);

	return passRef.remove();
}

function updatePassword(userID, updatedPassword) {
	if (!checkIfValidUserID(userID) || !updatedPassword) {
		return Observable.throw(new Error('Invalid UserID and/or Missing Password Info'));
	}
	updateUserLastAccess(userID);

	const { serviceName, userName, password, createdAt, id } = updatedPassword;
	const passRef = getPasswordReference(userID, id);

	const updated = {
		serviceName: serviceName || '',
		userName: userName || '',
		password: password || '',
		updatedAt: Date.now(),
		createdAt: createdAt,
	};

	const encrypted = encrypt(updated);

	return Observable.fromPromise(passRef.set(encrypted));
}

function setMasterPassword(password) {
	const userID = getUserID();

	if (!checkIfValidUserID(userID) || !password) {
		return Observable.throw(new Error(`Invalid UserID and/or Missing Password`));
	}

	const hash = generatePasswordHash(password);
	const mPassRef = getMasterPasswordReference(userID);

	return Observable.fromPromise(mPassRef.set(hash))
		.debounceTime(1000);
}

function checkIfValidMasterPassword(mPass) {
	const userID = getUserID();

	if (!checkIfValidUserID(userID) || !mPass) {
		return Observable.throw(new Error(`Invalid UserID and/or Missing Password`));
	}

	const mPassRef = getMasterPasswordReference(userID);

	return Observable.fromPromise(mPassRef.once('value'))
		.map(extractData)
		.map(hash => compareHashToPassword(mPass, hash));
}

/**
 * Error Logging
 */

function logError(err) {
	if (!err) { return; }

	const errRef = firebase.database().ref('errors');
	const newErrRef = errRef.push();

	newErrRef.set({ ...err });
}

export default {
	checkIfValidUserID,
	checkIfUserExists,
	createUser,
	deleteUser,
	updateUserLastAccess,
	createNewPassword,
	getPasswordDetails,
	getPasswords,
	updatePassword,
	deletePassword,
	setMasterPassword,
	checkIfValidMasterPassword,
	logError,
};