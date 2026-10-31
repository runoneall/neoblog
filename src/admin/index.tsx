import { Hono } from 'hono';
import { DBVariable } from '../db';
import { ConfigVariable } from '../config';
import { ThemeVariable } from '../theme';
import dashboard from './dashboard';
import needauth from './needauth';
import { createHash, timingSafeEqual } from 'crypto';
import { sign } from 'hono/jwt';
import { aes256gcmkey, encrypt } from './aes256gcm';
import { setCookie } from 'hono/cookie';

const app = new Hono<{ Variables: DBVariable & ConfigVariable & ThemeVariable }>();
app.route('/dashboard', dashboard);

app.get('/', needauth, (c) => {
	return c.redirect('/admin/dashboard');
});

app.get('/login', (c) => {
	return c.render(
		<div class="w-dvw h-dvh flex items-center justify-center">
			<form class="flex items-center gap-x-1" action="/admin/login" method="post">
				<input class="outline" type="password" name="password" />
				<button class="cursor-pointer" type="submit">
					Login
				</button>
			</form>
		</div>,
	);
});

app.post('/login', async (c) => {
	const body = await c.req.formData();
	const password = body.get('password') as string;
	if (!timingSafeEqual(Buffer.from(createHash('sha256').update(password).digest('hex')), Buffer.from(c.var.config.password_hash)))
		return c.redirect('/admin/login');

	const jwt_token = await sign(
		{
			password_hash: c.var.config.password_hash,
			exp: Math.floor(Date.now() / 1000),
		},
		c.var.config.jwt_secret,
		'HS256',
	);

	const jwt_token_encrypted = encrypt(jwt_token, aes256gcmkey(c.var.config.jwt_secret));
	setCookie(c, 'auth', jwt_token_encrypted, {
		httpOnly: true,
		sameSite: 'strict',
		maxAge: 24 * 60 * 60,
	});

	return c.redirect('/admin/dashboard');
});

export default app;
