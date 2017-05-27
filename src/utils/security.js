import bcrypt from 'bcryptjs';
import sjcl from 'sjcl';
import secret from '../config/secret';

export function encrypt(data) {
	if (!data) { return null; }

	let temp = data;

	if (typeof data === 'object') {
		temp = JSON.stringify({ ...data });
	}

	return sjcl.encrypt(secret.key, temp);
}

export function decrypt(data) {
	if (!data) { return null; }

	const decrypted = sjcl.decrypt(secret.key, data);

	return JSON.parse(decrypted);
}

export function generatePasswordHash(password) {
	if (!password) { return null; }

	return bcrypt.hashSync(password, 10);
}

export function compareHashToPassword(password, hash) {
	if (!password || !hash) { return null; }
	
	return bcrypt.compareSync(password, hash);
}

export default {
	encrypt,
	decrypt,
	generatePasswordHash,
	compareHashToPassword,
};