import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
// import secret from '../config/secret';
import { handleError } from './error-handler';
import {
	encrypt, decrypt, generatePasswordHash } from './security';


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
		handleError('Invalid UserID for action updateUserLastAccess');
		return Observable.throw(new Error('Invalid UserID'));
	}

	const lsRef = firebase.database().ref(`/users/${userID}/lastAccess`);

	return Observable.fromPromise(lsRef.set(Date.now()));
}

/**
 * Password Functions
 */
function getPasswordReference(userID, passwordID) {
	return firebase.database().ref(`/users/${userID}/passwords/${passwordID}`);
}

function getPasswordDetails(userID, passwordID) {
	if (!userID || !passwordID) {
		handleError('Invalid UserID for action getPasswordDetails');
		return Observable.throw(new Error('Invalid UserID'));
	}
	updateUserLastAccess(userID);

	const passRef = getPasswordReference(userID, passwordID);

	return Observable.fromPromise(passRef.once('value')).delay(500);
}

function updatePassword(userID, updatedPassword) {
	if (!checkIfValidUserID(userID) || !updatedPassword) {
		handleError('Invalid UserID and/or Missing Password Details');
		return Observable.throw('Invalid UserID and/or Missing Password Details');
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

export {
	getPasswordDetails,
	updatePassword,
};