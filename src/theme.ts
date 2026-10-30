import { Context, Next } from 'hono';
import { DBVariable } from './db';
import { ConfigVariable } from './config';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { eq, sql } from 'drizzle-orm';

export const ThemeTable = sqliteTable('theme', {
	name: text().notNull().primaryKey(),
	config: text({ mode: 'json' }).notNull().$type<ThemeVariable['theme']>(),
});

export type ThemeVariable = {
	theme: Record<string, string | undefined>;
};

export default async (c: Context<{ Variables: DBVariable & ConfigVariable & ThemeVariable }>, next: Next) => {
	try {
		const theme_config = await c.var.db
			.select({
				config: ThemeTable.config,
			})
			.from(ThemeTable)
			.where(eq(ThemeTable.name, c.var.config.theme_name))
			.get();

		if (!theme_config) throw null;
		c.set('theme', theme_config.config);
	} catch {
		await c.var.db.run(sql`
            CREATE TABLE IF NOT EXISTS theme (
                name TEXT NOT NULL PRIMARY KEY,
                config TEXT NOT NULL
            );
        `);

		await c.var.db.insert(ThemeTable).values({
			name: c.var.config.theme_name,
			config: {},
		});

		c.set('theme', {});
	}

	return await next();
};
