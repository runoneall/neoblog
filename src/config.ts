import { Context, Next } from 'hono';
import { DBVariable } from './db';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { createHash, randomBytes } from 'crypto';

export const ConfigTable = sqliteTable('config', {
	id: integer()
		.notNull()
		.primaryKey()
		.$default(() => 1),
	site_name: text().notNull(),
	theme_name: text().notNull(),
	post_per_page: integer().notNull(),
	extra_css: text().notNull(),
	extra_js: text().notNull(),
	password_hash: text().notNull(),
	jwt_secret: text().notNull(),
});

export type ConfigVariable = {
	config: {
		site_name: string;
		theme_name: string;
		post_per_page: number;
		extra_css: string;
		extra_js: string;
		password_hash: string;
		jwt_secret: string;
	};
};

export default async (c: Context<{ Variables: DBVariable & ConfigVariable }>, next: Next) => {
	try {
		const config_in_db = await c.var.db.select().from(ConfigTable).get();
		if (!config_in_db) throw null;
		c.set('config', config_in_db);
	} catch {
		await c.var.db.run(sql`
            CREATE TABLE IF NOT EXISTS config (
                id INTEGER NOT NULL PRIMARY KEY CHECK (id = 1),
                site_name TEXT NOT NULL,
                theme_name TEXT NOT NULL,
                post_per_page INTEGER NOT NULL,
                extra_css TEXT NOT NULL,
                extra_js TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                jwt_secret TEXT NOT NULL
            );
        `);

		const default_config: ConfigVariable['config'] = {
			site_name: 'MyBlog',
			theme_name: 'IndexOf',
			post_per_page: 10,
			extra_css: '',
			extra_js: '',
			password_hash: createHash('sha256').update('admin').digest('hex'),
			jwt_secret: randomBytes(32).toHex(),
		};

		await c.var.db.insert(ConfigTable).values(default_config).onConflictDoNothing();
		c.set('config', default_config);
	}

	return await next();
};
