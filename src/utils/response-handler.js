import { decrypt } from './security';

export function extractData(data) {
	if (!data) { return null; }

	return data.val();
}

export function decryptUserPasswords(data) {
	if (!data) { return null; }

	const passwords = Object.assign({}, data);
	const decrypted = {};

	Object.keys(passwords).map((id) => {
		decrypted[id] = decrypt(passwords[id]);
	});

	return decrypted;
}

export default {
	extractData,
	decryptUserPasswords,
};