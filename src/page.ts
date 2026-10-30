import { Context, Next } from 'hono';
import { DBVariable } from './db';
import { ConfigVariable } from './config';
import { ThemeVariable } from './theme';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const PageTable = sqliteTable('page', {
	name: text().notNull().primaryKey(),
	type: text().notNull().$type<'page' | 'post'>(),
	title: text().notNull().unique(),
	content: text().notNull().default(''),
});

export default async (c: Context<{ Variables: DBVariable & ConfigVariable & ThemeVariable }>, next: Next) => {
	try {
		await c.var.db.select().from(PageTable).get();
	} catch {
		await c.var.db.run(sql`
            CREATE TABLE page (
                name TEXT NOT NULL PRIMARY KEY,
                type TEXT NOT NULL CHECK (type IN ('page', 'post')),
                title TEXT NOT NULL UNIQUE,
                content TEXT NOT NULL DEFAULT ''
            );
        `);
	}

	return await next();
};
