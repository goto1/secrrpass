function login({ userID, passwordProtected }) {
	if (!userID) { return; }
	const details = JSON.stringify({ userID, passwordProtected });

	localStorage.setItem('user', details);
}

function logout() {
	localStorage.remove('user');
}

function getUserID() {
	let userID = null;

	const userInfo = localStorage.getItem('user') || null;

	if (userInfo) {
		userID = JSON.parse(userInfo).userID;
	}

	return userID;
}

function isAccountPasswordProtected() {
	let pprotected = false;
	const user = localStorage.getItem('user') || null;

	if (user) {
		pprotected = JSON.parse(user).passwordProtected;
	}

	return pprotected;
}

export default {
	login, 
	logout, 
	getUserID, 
	isAccountPasswordProtected,
};