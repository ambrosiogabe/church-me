const crypto = require("crypto");

const SALT_LENGTH = 16;
const HASH_DELIM = ':';
const PBKDF2_ARGS = Object.freeze([20000, 16, "sha512"]);	// iterations, key length, hash algorithm

/*
 * `hashPassword` and `verifyHash` are paraphrased from code contained in a post by Harshit Pant, found at this URL:
 * https://hptechblogs.com/password-hashing-in-node-js-using-the-pbkdf2-in-crypto-library/ .
 */

function hashPassword(password)
{
	var salt = crypto.randomBytes(SALT_LENGTH).toString("hex");
	var hash = crypto.pbkdf2Sync(password, salt, ...PBKDF2_ARGS).toString("hex");
	return [salt, hash].join(HASH_DELIM);
}

function verifyHash(password, original)
{
	var attempt = crypto.pbkdf2Sync(password, original.split(HASH_DELIM)[0], ...PBKDF2_ARGS).toString("hex");
	return original === attempt;
}

module.exports.hashPassword = hashPassword;
module.exports.verifyHash = verifyHash;