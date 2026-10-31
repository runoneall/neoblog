import { Context, Next } from 'hono';
import { DBVariable } from '../db';
import { ConfigVariable } from '../config';
import { ThemeVariable } from '../theme';
import { getCookie, setCookie } from 'hono/cookie';
import { aes256gcmkey, decrypt, encrypt } from './aes256gcm';
import { decode, sign, verify } from 'hono/jwt';
import { timingSafeEqual } from 'crypto';

export default async (c: Context<{ Variables: DBVariable & ConfigVariable & ThemeVariable }>, next: Next) => {
	const jwt_token_encrypted = getCookie(c, 'auth');
	if (!jwt_token_encrypted) return c.redirect('/admin/login');

	let jwt_token: string = '';
	try {
		jwt_token = decrypt(jwt_token_encrypted, aes256gcmkey(c.var.config.jwt_secret));
	} catch {
		return c.redirect('/admin/login');
	}

	try {
		await verify(jwt_token, c.var.config.jwt_secret, 'HS256');
	} catch {
		try {
			const { payload } = decode(jwt_token);
			if (!timingSafeEqual(Buffer.from(payload.password_hash as string), Buffer.from(c.var.config.password_hash))) throw null;
		} catch {
			return c.redirect('/admin/login');
		}
	}

	const new_jwt_token = await sign(
		{
			password_hash: c.var.config.password_hash,
			exp: Math.floor(Date.now() / 1000),
		},
		c.var.config.jwt_secret,
		'HS256',
	);

	const new_jwt_token_encrypted = encrypt(new_jwt_token, aes256gcmkey(c.var.config.jwt_secret));
	setCookie(c, 'auth', new_jwt_token_encrypted, {
		httpOnly: true,
		sameSite: 'strict',
		maxAge: 24 * 60 * 60,
	});

	return await next();
};
