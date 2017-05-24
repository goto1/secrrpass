import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import ErrorHandler from './error-handler';
import { extractData, decryptUserPasswords } from './response-handler';
import { 
	encrypt, decrypt, 
	generatePasswordHash, compareHashToPassword } from './security';

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

function checkIfUserExists(userID) {
	if (!checkIfValidUserID(userID)) {
		const err = new Error('Invalid UserID');
		ErrorHandler.log({ err: err, location: 'api.js:28' });
		return Observable.throw(err);
	}

	const userRef = getUserReference(userID);

	return Observable.fromPromise(userRef.once('value'))
						.map(extractData);
}

function updateUserLastAccess(userID) {
	if (!checkIfValidUserID(userID)) {
		ErrorHandler.log('Invalid UserID for action updateUserLastAccess');
		return Observable.throw(new Error('Invalid UserID'));
	}

	const lsRef = firebase.database().ref(`/users/${userID}/lastAccess`);

	return Observable.fromPromise(lsRef.set(Date.now()));
}

function createNewUser(userID) {
	if (!checkIfValidUserID(userID)) {
		const err = new Error('Invalid UserID');
		ErrorHandler.log({ err: err, location: 'api.js:51' });
		return Observable.throw(err);
	}

	const userRef = getUserReference(userID);
	const access = { firstAccess: Date.now(), lastAccess: Date.now() };

	return Observable.fromPromise(userRef.set(access));
}

function deleteUser(userID) {
	if (!checkIfValidUserID(userID)) {
		const err = new Error('Invalid UserID');
		ErrorHandler.log(err);
		return Observable.throw(err);
	}

	const userRef = getUserReference(userID);

	return Observable.fromPromise(userRef.remove());
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

function getUserPasswords(userID) {
	if (!checkIfValidUserID(userID)) {
		const err = new Error(`Invalid UserID`);
		ErrorHandler.log(err);
		return Observable.throw(err);
	}
	updateUserLastAccess(userID);

	const passRef = firebase.database().ref(`/users/${userID}/passwords`);

	return Observable.fromPromise(passRef.once('value'))
		.map(extractData)
		.map(decryptUserPasswords);
}

function getPasswordDetails(userID, passwordID) {
	if (!userID || !passwordID) {
		ErrorHandler.log('Invalid UserID for action getPasswordDetails');
		return Observable.throw(new Error('Invalid UserID'));
	}
	updateUserLastAccess(userID);

	const passRef = getPasswordReference(userID, passwordID);

	return Observable.fromPromise(passRef.once('value')).delay(500);
}

function deletePassword(userID, passwordID) {
	if (!checkIfValidUserID(userID) || !checkIfValidPasswordID(passwordID)) {
		const err = new Error('Invalid UserID and/or PasswordID');
		ErrorHandler.log(err);
		return Observable.throw(err);
	}
	updateUserLastAccess(userID);

	const passRef = getPasswordReference(userID, passwordID);

	return Observable.fromPromise(passRef.remove());
}

function updatePassword(userID, updatedPassword) {
	if (!checkIfValidUserID(userID) || !updatedPassword) {
		const err = new Error(`Invalid UserID and/or Missing Password`);

		ErrorHandler.log(err);
		return Observable.throw(err);
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

function setMasterPassword(userID, password) {
	if (!checkIfValidUserID(userID) || !password) {
		const err = new Error(`Invalid UserID and/or Missing Password`);

		ErrorHandler.log(err);
		return Observable.throw(err);
	}
	updateUserLastAccess(userID);

	const hash = generatePasswordHash(password);
	const masterPasswordReference = getMasterPasswordReference(userID);

	return Observable.fromPromise(masterPasswordReference.set(hash));
}

function checkIfMasterPasswordIsCorrect(userID, password) {
	if (!checkIfValidUserID(userID) || !password) {
		const err = new Error(`Invalid UserID and/or Missing Password`);

		ErrorHandler.log(err);
		return Observable.throw(err);
	}

	const mPassRef = getMasterPasswordReference(userID);

	return Observable.fromPromise(mPassRef.once('value'))
						.map(extractData)
						.map(hash => compareHashToPassword(password, hash))
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
	checkIfUserExists,
	createNewUser,
	deleteUser,
	updateUserLastAccess,
	getPasswordDetails,
	getUserPasswords,
	updatePassword,
	deletePassword,
	setMasterPassword,
	checkIfMasterPasswordIsCorrect,
	logError,
};