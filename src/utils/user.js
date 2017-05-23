function logIn({ userID, passwordProtected }) {
	if (!userID || !passwordProtected) { return; }
	const details = JSON.stringify({ userID, passwordProtected });

	localStorage.setItem('user', details);
}

function logOut() {
	localStorage.removeItem('user');
}

function getUserID() {
	let userID = null;

	const userInfo = localStorage.getItem('user') || null;

	if (userInfo) {
		userID = JSON.parse(userInfo).userID;
	}

	return userID;
}

function checkIfPasswordProtected(userID) {
	if (!userID) { return; }

	let passwordProtected = false;
	let userInfo = localStorage.getItem('user') || null;

	if (userInfo) {
		passwordProtected = JSON.parse(userInfo).passwordProtected;
	}

	return passwordProtected;
}

export default {
	logIn, logOut, getUserID, checkIfPasswordProtected,
};