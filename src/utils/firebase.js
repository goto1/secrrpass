import * as firebase from 'firebase';
import secret from '../config/secret';
import securityUtils from './security-utils';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/delay';

// import 'rxjs/add/operator/map';

firebase.initializeApp(securityUtils.decrypt(secret.firebase));

const checkIfValidUserID = (userID) => {
	const regex = /^\w{6}$/;
	const isValid = 
		(typeof userID === 'string' && regex.test(userID)) ? true : false;

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

const createNewPassword = (userID, passwordDetails) => {
	if (!checkIfValidUserID(userID) || !passwordDetails) { return; }
	updateUserLastAccess(userID);

	const passwordID = firebase.database().ref().child('passwords').push().key;
	const passRef = getPassReference(userID, passwordID);

	const { serviceName, userName, password } = passwordDetails;

	const newPassword = {
		serviceName: serviceName || '',
		userName: userName || '',
		password: password || '',
		createdAt: Date.now(),
		updatedAt: Date.now(),
	};

	const encryptedPassInfo = securityUtils.encrypt(newPassword);

	passRef.set(encryptedPassInfo);
};

const getUserPasswords = (userID) => {
	if (!checkIfValidUserID(userID)) {
		return Observable.throw(new Error('Invalid UserID'));
	}
	updateUserLastAccess(userID);

	const passwordsRef = 
		firebase.database().ref(`/users/${userID}/passwords`);

	return Observable
					.fromPromise(passwordsRef.once('value'))
					.delay(2000);
}

const editPassword = (userID, passwordID, updatedPassword) => {
	if (!checkIfValidUserID(userID) || !checkIfValidPasswordID(passwordID)) {
		return new Promise((resolve, reject) => {
			reject('Invalid UserID and/or PasswordID');
		});
	}
	updateUserLastAccess(userID);

	const updates = {
		[`/users/${userID}/passwords/${passwordID}`]: securityUtils.encrypt(updatedPassword),
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

	const hash = securityUtils.generatePasswordHash(masterPassword);
	const masterPassRef = getMasterPassReference(userID);

	masterPassRef.set(hash);
};

const checkIfMasterPasswordIsSet = (userID) => {
	if (!checkIfValidUserID) {
		return new Promise.reject('Invalid UserID');
	}
	updateUserLastAccess(userID);

	const masterPassRef = getMasterPassReference(userID);

	return masterPassRef.once('value');
};

const checkIfMasterPasswordIsValid = (userID, masterPassword) => {
	if (!checkIfValidUserID || !masterPassword) { return; }

	checkIfUserExists(userID)
		.then((user) => {
			if (user.val() !== null) {
				const hash = user.val().masterPassword;

				// Returns true if positive match, otherwise false
				return securityUtils.compareHashToPassword(masterPassword, hash);
			}
		})
		.catch((err) => { console.log(err); });
};

export default {
	checkIfUserExists,
	createNewUser,
	deleteUser,
	setMasterPassword,
	checkIfMasterPasswordIsSet,
	checkIfMasterPasswordIsValid,
	createNewPassword,
	editPassword,
	deletePassword,
	getUserPasswords,
	updateUserLastAccess,
};