import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import secret from '../config/secret';
import { extractData, decryptUserPasswords } from './response-handler';
import { getUserID, logout } from './user';
import { 
	encrypt, decrypt, 
	generatePasswordHash, compareHashToPassword } from './security';

firebase.initializeApp(decrypt(secret.firebase));

const database = firebase.database;

/**
 * User Functions
 */

function getFirebaseUserRef() {
	const userID = getUserID();

	return database().ref(`/users/${userID}`);
}

function isUserIDValid() {
	const userID = getUserID();
	const regex = /^\w{6}$/;
	const valid =
		(typeof userID === 'string' && regex.test(userID)) ? true : false;

	return valid;
}

function checkIfUserExists() {
	if (isUserIDValid() === false) {
		return Promise.reject(new Error('Invalid UserID'));
	}

	const userRef = getFirebaseUserRef();

	return userRef.once('value').then(extractData);
}

function updateUserLastAccess(userID) {
	if (isUserIDValid() === false) {
		return Observable.throw(new Error('Invalid UserID'));
	}

	const lsRef = firebase.database().ref(`/users/${userID}/lastAccess`);

	return Observable.fromPromise(lsRef.set(Date.now()));
}

function createUser() {
	if (isUserIDValid() === false) {
		return Promise.reject(new Error('Invalid UserID'));
	}

	const userRef = getFirebaseUserRef();
	const userInfo = { firstAccess: Date.now(), lastAccess: Date.now() };

	return userRef.set(userInfo);
}

function deleteUser() {
	if (isUserIDValid() === false) {
		return Promise.reject(new Error('Invalid UserID'));
	}

	const userRef = getFirebaseUserRef();

	logout();

	return userRef.remove();
}

/**
 * Password Functions
 */
function isPasswordIDValid(passID) {
	const valid = 
		(typeof passID === 'string' && passID.length === 20) ? true : false;

	return valid; 
}

function getFirebasePasswordReference(passID) {
	const userID = getUserID();

	return database().ref(`/users/${userID}/passwords/${passID}`);
}

function getFirebasetMasterPasswordReference() {
	const userID = getUserID();

	return database().ref(`/users/${userID}/masterPassword`);
}

function createNewPassword(userID, passwordInfo) {
	if (isUserIDValid() === false || !passwordInfo) {
		return Observable.throw(new Error(`Invalid UserID and/or Missing Password Information`));
	}

	const passID = firebase.database().ref().child('passwords').push().key;
	const passRef = getFirebasePasswordReference(passID);
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

	if (isUserIDValid() === false) {
		return Promise.reject(new Error(`Invalid UserID`));
	}

	const passwordsRef = database().ref(`/users/${userID}/passwords`);

	return passwordsRef.once('value')
		.then(extractData)
		.then(decryptUserPasswords);
}

function getPassword(passID) {
	if (!isUserIDValid() || !isPasswordIDValid(passID)) {
		return Promise.reject(new Error('Invalid UserID and/or PasswordID'));
	}

	const passRef = getFirebasePasswordReference(passID);

	return passRef.once('value')
		.then(extractData)
		.then(decrypt);
}

function deletePassword(passID) {
	console.log(passID);

	if (!isUserIDValid() || !isPasswordIDValid(passID)) {
		return Promise.reject(new Error('Invalid UserID and/or PasswordID'));
	}

	const passRef = getFirebasePasswordReference(passID);

	return passRef.remove();
}

function updatePassword(updatedInfo) {
	if (!isUserIDValid() || !updatedInfo) {
		return Observable.throw(new Error(`Invalid UserID and/or Missing Password Information`));
	}

	const { serviceName, userName, password, createdAt, id } = updatedInfo;
	const passRef = getFirebasePasswordReference(id);
	const updatedPass = { 
		serviceName, 
		userName, 
		password, 
		createdAt, 
		updatedAt: Date.now() 
	};

	return Observable.fromPromise(passRef.set(encrypt(updatedPass)))
		.debounceTime(1000);
}

function setMasterPassword(password) {
	if (!isUserIDValid() || !password) {
		return Observable.throw(new Error(`Invalid UserID and/or Missing Password`));
	}

	const hash = generatePasswordHash(password);
	const mPassRef = getFirebasetMasterPasswordReference();

	return Observable.fromPromise(mPassRef.set(hash))
		.debounceTime(1000);
}

function checkIfValidMasterPassword(mPass) {
	if (isUserIDValid === false || !mPass) { 
		return Observable.throw(new Error(`Invalid UserID and/or Missing Password`));
	}

	const mPassRef = getFirebasetMasterPasswordReference();

	return Observable.fromPromise(mPassRef.once('value'))
		.map(extractData)
		.map(hash => compareHashToPassword(mPass, hash));
}

/**
 * Error Logging
 */

function logError(err) {
	if (!err) { return; }

	const errorsRef = database().ref('errors');

	errorsRef.push().set({ ...err });
}

export default {
	checkIfUserExists,
	createUser,
	deleteUser,
	updateUserLastAccess,
	isPasswordIDValid,
	createNewPassword,
	getPasswords,
	getPassword,
	updatePassword,
	deletePassword,
	setMasterPassword,
	checkIfValidMasterPassword,
	logError,
};