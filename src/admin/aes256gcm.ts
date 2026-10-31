import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';

export const aes256gcmkey = (secret: string) => createHash('sha256').update(secret).digest();

export const encrypt = (text: string, key: Buffer) => {
	const iv = randomBytes(12);
	const cipher = createCipheriv('aes-256-gcm', key, iv);
	const data = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
	const authTag = cipher.getAuthTag().toString('hex');

	return `${iv.toString('hex')}:${authTag}:${data}`;
};

export const decrypt = (data: string, key: Buffer) => {
	const [ivHex, authTagHex, encryptedText] = data.split(':');
	if (!ivHex || !authTagHex || !encryptedText) throw new Error('incorrect format');

	const iv = Buffer.from(ivHex, 'hex');
	const authTag = Buffer.from(authTagHex, 'hex');
	const decipher = createDecipheriv('aes-256-gcm', key, iv);

	decipher.setAuthTag(authTag);
	return decipher.update(encryptedText, 'hex', 'utf8') + decipher.final('utf8');
};
