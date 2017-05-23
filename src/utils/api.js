import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import ErrorHandler from './error-handler';
import { extractData } from './response-handler';
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

function updateUserLastAccess(userID) {
	if (!checkIfValidUserID(userID)) {
		ErrorHandler.log('Invalid UserID for action updateUserLastAccess');
		return Observable.throw(new Error('Invalid UserID'));
	}

	const lsRef = firebase.database().ref(`/users/${userID}/lastAccess`);

	return Observable.fromPromise(lsRef.set(Date.now()));
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

function getPasswordReference(userID, passwordID) {
	return firebase.database().ref(`/users/${userID}/passwords/${passwordID}`);
}

function getMasterPasswordReference(userID) {
	return firebase.database().ref(`/users/${userID}/masterPassword`);
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
	deleteUser,
	getPasswordDetails,
	updatePassword,
	setMasterPassword,
	checkIfMasterPasswordIsCorrect,
};