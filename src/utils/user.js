import { encrypt, decrypt } from './security';

function init(userID, mPasswordSet = false) {
	if (!userID) { return; }

	const info = { userID, mPasswordSet, sessionExpiration: null };

	localStorage.setItem('info', encrypt(info));
}

function login() {
	const userInfo = getUserInfo();
	const expirationDate = new Date();
	expirationDate.setMinutes(expirationDate.getMinutes() + 10);

	const updatedInfo = {
		...userInfo,
		expirationDate: expirationDate.getTime(),
	};

	localStorage.setItem('info', encrypt(updatedInfo));
}

export function logout() {
	localStorage.removeItem('info');
}

function getUserInfo() {
	const info = localStorage.getItem('info');

	return info !== null ? decrypt(info) : null;
}

export function getUserID() {
	const userInfo = getUserInfo();

	return userInfo !== null ? userInfo.userID : null;
}

function isSessionExpired() {
	const expirationDate = getUserInfo().expirationDate;
	const currentDate = new Date().getTime();
	let expired = true;

	if (expirationDate !== undefined) {
		expired = expirationDate < currentDate ? true : false;
	}

	return expired;
}

function isAccountProtected() {
	const userInfo = getUserInfo();

	return userInfo.mPasswordSet;
}

export default {
	init,
	login,
	logout,
	getUserID,
	isSessionExpired,
	isAccountProtected,
};