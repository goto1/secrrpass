import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import ErrorHandler from './error-handler';
import secret from '../config/secret';
import { extractData, decryptUserPasswords } from './response-handler';
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

function checkIfUserExists(userID) {
	if (!checkIfValidUserID(userID)) {
		return Observable.throw(new Error('Invalid UserID'));
	}

	const userRef = getUserReference(userID);

	return Observable.fromPromise(userRef.once('value'))
						.map(extractData);
}

function updateUserLastAccess(userID) {
	if (!checkIfValidUserID(userID)) {
		return Observable.throw(new Error('Invalid UserID'));
	}

	const lsRef = firebase.database().ref(`/users/${userID}/lastAccess`);

	return Observable.fromPromise(lsRef.set(Date.now()));
}

function createNewUser(userID) {
	if (!checkIfValidUserID(userID)) {
		return Observable.throw(new Error('Invalid UserID'));
	}

	const userRef = getUserReference(userID);
	const access = { firstAccess: Date.now(), lastAccess: Date.now() };

	return Observable.fromPromise(userRef.set(access));
}

function deleteUser(userID) {
	if (!checkIfValidUserID(userID)) {
		return Observable.throw(new Error('Invalid UserID'));
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

function getUserPasswords(userID) {
	if (!checkIfValidUserID(userID)) {
		return Observable.throw(new Error('Invalid UserID'));
	}
	updateUserLastAccess(userID);

	const passRef = firebase.database().ref(`/users/${userID}/passwords`);

	return Observable.fromPromise(passRef.once('value'))
		.map(extractData)
		.map(decryptUserPasswords);
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

function deletePassword(userID, passwordID) {
	if (!checkIfValidUserID(userID) || !checkIfValidPasswordID(passwordID)) {
		return Observable.throw(new Error('Invalid UserID and/or PasswordID'));
	}
	updateUserLastAccess(userID);

	const passRef = getPasswordReference(userID, passwordID);

	return Observable.fromPromise(passRef.remove());
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

function setMasterPassword(userID, password) {
	if (!checkIfValidUserID(userID) || !password) {
		return Observable.throw(new Error('Invalid UserID and/or Missing Password Info'));
	}
	updateUserLastAccess(userID);

	const hash = generatePasswordHash(password);
	const masterPasswordReference = getMasterPasswordReference(userID);

	return Observable.fromPromise(masterPasswordReference.set(hash));
}

function checkIfMasterPasswordIsCorrect(userID, password) {
	if (!checkIfValidUserID(userID) || !password) {
		return Observable.throw(new Error('Invalid UserID and/or Missing Password Info'));
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
	createNewPassword,
	getPasswordDetails,
	getUserPasswords,
	updatePassword,
	deletePassword,
	setMasterPassword,
	checkIfMasterPasswordIsCorrect,
	logError,
};