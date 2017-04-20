import bcrypt from 'bcryptjs';
import sjcl from 'sjcl';
import secret from '../config/secret';

const encrypt = (data) => {
	const json = JSON.stringify(data);
	return sjcl.encrypt(secret.key, json);
};

const decrypt = (data) => {
	const decrypted = sjcl.decrypt(secret.key, data);
	return JSON.parse(decrypted);
};

const generatePasswordHash = (password) => 
	bcrypt.hashSync(password, 10);

const compareHashToPassword = (password, hash) => 
	bcrypt.compareSync(password, hash);

export default {
	encrypt,
	decrypt,
	generatePasswordHash,
	compareHashToPassword,
};