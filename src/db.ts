import { D1Database } from '@cloudflare/workers-types';
import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1';
import { Context, Next } from 'hono';

export type DBVariable = {
	db: DrizzleD1Database;
};

export default async (
	c: Context<{
		Bindings: {
			db: D1Database;
		};
		Variables: DBVariable;
	}>,
	next: Next,
) => {
	c.set('db', drizzle(c.env.db));
	return await next();
};
