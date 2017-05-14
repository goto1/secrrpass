import bcrypt from 'bcryptjs';
import sjcl from 'sjcl';
import secret from '../config/secret';

function encrypt(data) {
	const json = JSON.stringify(data);

	return sjcl.encrypt(secret.key, json);
}

function decrypt(data) {
	const decrypted = sjcl.decrypt(secret.key, data);

	return JSON.parse(decrypted);
}

function generatePasswordHash(password) {
	return bcrypt.hashSync(password, 10);
}

function compareHashToPassword(password, hash) {
	return bcrypt.compareSync(password, hash);
}

export {
	encrypt,
	decrypt,
	generatePasswordHash,
	compareHashToPassword,
};