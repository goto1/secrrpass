import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import secret from '../config/secret';
import securityUtils from './security-utils';

firebase.initializeApp(securityUtils.decrypt(secret.firebase));

const getUserReference =
	(userID) => firebase.database().ref(`/users/${userID}`);

const getPassReference =
	(userID, passwordID) => firebase.database().ref(`/users/${userID}/passwords/${passwordID}`);

const getMasterPassReference =
	(userID) => firebase.database().ref(`/users/${userID}/masterPassword`);

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

const checkIfUserExists = (userID) => {
	if (!checkIfValidUserID(userID)) {
		return Observable.throw(new Error('Invalid UserID'));
	}

	const userRef = getUserReference(userID);

	return Observable.fromPromise(userRef.once('value'));
};

const createNewUser = (userID) => {
	if (!checkIfValidUserID(userID)) {
		return Observable.throw(new Error('Invalid UserID'));
	}

	const userRef = getUserReference(userID);
	const info = { firstAccess: Date.now(), lastAccess: Date.now() };

	return Observable.fromPromise(userRef.set(info));
};

const deleteUser = (userID) => {
	if (!checkIfValidUserID(userID)) {
		return Observable.throw(new Error('Invalid UserID'));
	}

	const userRef = getUserReference(userID);

	return Observable.fromPromise(userRef.remove());
};

const updateUserLastAccess = (userID) => {
	if (!checkIfValidUserID(userID)) {
		return Observable.throw(new Error('Invalid UserID'));
	}

	const lastAccess = firebase.database().ref(`/users/${userID}/lastAccess`);

	return Observable.fromPromise(lastAccess.set(Date.now()));
};

const createNewPassword = (userID, passwordDetails) => {
	if (!checkIfValidUserID(userID) || !passwordDetails) {
		return Observable.throw(new Error('Invalid UserID and/or Missing Password Details'));
	}
	updateUserLastAccess(userID).subscribe();

	const passID = firebase.database.ref().child('passwords').push().key;
	const passRef = getPassReference(userID, passID);
	const { serviceName, userName, password } = passwordDetails;
	const newPass = {
		serviceName: serviceName || '',
		userName: userName || '',
		password: password || '',
		createdAt: Date.now(),
		updatedAt: Date.now(),
	};
	const passInfo = securityUtils.encrypt(newPass);

	return Observable.fromPromise(passRef.set(passInfo));
};

const getUserPasswords = (userID) => {
	if (!checkIfValidUserID(userID)) {
		return Observable.throw(new Error('Invalid UserID'));
	}
	updateUserLastAccess(userID).subscribe();

	const passwordsRef = firebase.database().ref(`/users/${userID}/passwords`);

	return Observable.fromPromise(passwordsRef.once('value')).delay(1000);
};

const editPassword = (userID, passwordID, updatedDetails) => {
	if (!checkIfValidUserID(userID) || !checkIfValidPasswordID(passwordID)) {
		return Observable.throw(new Error('Invalid UserID and/or PasswordID'));
	}
	updateUserLastAccess(userID).subscribe();

	const passRef = getPassReference(userID, passwordID);
	const encryptedPassInfo = securityUtils.encrypt(updatedDetails);

	return Observable.fromPromise(passRef.update(encryptedPassInfo)).debounceTime(1000);
};

const deletePassword = (userID, passwordID) => {
	if (!checkIfValidUserID(userID) || !checkIfValidPasswordID(passwordID)) {
		return Observable.throw(new Error('Invalid UserID and/or PasswordID'));
	}
	updateUserLastAccess(userID).subscribe();

	const passRef = getPassReference(userID, passwordID);

	return Observable.fromPromise(passRef.remove());
};

const checkIfMasterPasswordIsSet = (userID) => {
	if (!checkIfValidUserID(userID)) {
		return Observable.throw(new Error('Invalid UserID'));
	}
	updateUserLastAccess(userID).subscribe();

	const masterPassRef = getMasterPassReference(userID);

	return Observable.fromPromise(masterPassRef.once('value'));
};

const setMasterPassword = (userID, password) => {
	if (!checkIfValidUserID(userID) || !password) {
		return Observable.throw(new Error('Invalid UserID and/or Password'));
	}
	updateUserLastAccess(userID).subscribe();

	const hash = securityUtils.generatePasswordHash(password);
	const masterPassRef = getMasterPassReference(userID);

	return Observable.fromPromise(masterPassRef.set(hash));
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

// const getUserPasswords = (userID) => {
// 	if (!checkIfValidUserID(userID)) {
// 		return Observable.throw(new Error('Invalid UserID'));
// 	}

// 	const extractData = (data) => data.val();

// 	checkIfUserExists(userID)
// 		.map(extractData)
// 		.subscribe(
// 			(user) => console.log(user),
// 			(err) => console.log(err),
// 		);

// 	updateUserLastAccess(userID);

// 	const passwordsRef = 
// 		firebase.database().ref(`/users/${userID}/passwords`);

// 	return Observable.fromPromise(passwordsRef.once('value')).delay(2000);
// }
// const createNewPassword = (userID, passwordDetails) => {
// 	if (!checkIfValidUserID(userID) || !passwordDetails) { return; }
// 	updateUserLastAccess(userID);

// 	const passwordID = firebase.database().ref().child('passwords').push().key;
// 	const passRef = getPassReference(userID, passwordID);

// 	const { serviceName, userName, password } = passwordDetails;

// 	const newPassword = {
// 		serviceName: serviceName || '',
// 		userName: userName || '',
// 		password: password || '',
// 		createdAt: Date.now(),
// 		updatedAt: Date.now(),
// 	};

// 	const encryptedPassInfo = securityUtils.encrypt(newPassword);

// 	passRef.set(encryptedPassInfo);
// };
// const setMasterPassword = (userID, masterPassword) => {
// 	if (!checkIfValidUserID(userID) || !masterPassword) { return; }
// 	updateUserLastAccess(userID);

// 	const hash = securityUtils.generatePasswordHash(masterPassword);
// 	const masterPassRef = getMasterPassReference(userID);

// 	masterPassRef.set(hash);
// };
// const deletePassword = (userID, passwordID) => {
// 	if (!checkIfValidUserID(userID) || !checkIfValidPasswordID(passwordID)) {
// 		return;
// 	}
// 	updateUserLastAccess(userID);

// 	const passRef = getPassReference(userID, passwordID);

// 	passRef.remove();
// };
// const checkIfMasterPasswordIsSet = (userID) => {
// 	if (!checkIfValidUserID) {
// 		return new Promise.reject('Invalid UserID');
// 	}
// 	updateUserLastAccess(userID);

// 	const masterPassRef = getMasterPassReference(userID);

// 	return masterPassRef.once('value');
// };