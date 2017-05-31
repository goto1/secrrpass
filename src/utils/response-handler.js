import * as _ from 'lodash';
import { decrypt } from './security';

export function extractData(data) {
	if (!data) { return null; }

	return data.val();
}

export function decryptUserPasswords(data) {
	if (!data) { return null; }

	const decrypted = _.reduce(data, (result, value, key) => {
		result[key] = decrypt(value);
		return result;
	}, {});

	return decrypted;
}

export default {
	extractData,
	decryptUserPasswords,
};