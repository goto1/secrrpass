import { decrypt } from './security';

function extractData(data) {
	if (!data) { return; }

	return data.val();
}

function decryptUserPasswords(data) {
	if (!data) { return; }

	const passwords = Object.assign({}, data);
	const decrypted = {};

	Object.keys(passwords).map((id) => {
		decrypted[id] = decrypt(passwords[id]);
	});

	return decrypted;
}

export {
	extractData,
	decryptUserPasswords,
};