import { encrypt, decrypt } from './security';

function login() {
	const expire = new Date();
	expire.setMinutes(expire.getMinutes() + 20);

	const session = getSessionInfo();
	const updated = encrypt({ ...session, expire });

	localStorage.setItem('user', updated);
}

function logout() {
	localStorage.removeItem('user');
}

function getSessionInfo() {
	const session = localStorage.getItem('user');

	return session !== null ? decrypt(session) : null;
}

function setUserID(userID) {
	if (!userID) { return; }

	const session = getSessionInfo();
	const updated = 
		session !== null ? encrypt({ userID, ...session }) : encrypt({ userID });

	localStorage.setItem('user', updated);
}

export function getUserID() {
	const session = getSessionInfo();

	return session !== null ? session.userID : null;
}

function getExpirationDate() {
	const session = getSessionInfo();

	return session !== null ? session.expire : null;
}

function isSessionExpired() {
	const expDate = getExpirationDate();
	const currDate = new Date().toISOString();

	return expDate < currDate ? true : false;
}

export default {
	login,
	logout,
	getUserID,
	getExpirationDate,
	isSessionExpired,
	setUserID,
};