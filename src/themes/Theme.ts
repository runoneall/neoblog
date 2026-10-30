import { Context } from 'hono';
import { FC } from 'hono/jsx';
import { DBVariable } from '../db';
import { ConfigVariable } from '../config';
import { ThemeVariable } from '../theme';

type Theme = {
	Layout: FC<{ c: Context<{ Variables: DBVariable & ConfigVariable & ThemeVariable }>; children: any }>;
	Main: FC<{ c: Context<{ Variables: DBVariable & ConfigVariable & ThemeVariable }>; page: number }>;
	Page: FC<{ c: Context<{ Variables: DBVariable & ConfigVariable & ThemeVariable }>; name: string }>;
	Search: FC<{ c: Context<{ Variables: DBVariable & ConfigVariable & ThemeVariable }>; query: string }>;
	NotFound: FC<{ c: Context<{ Variables: DBVariable & ConfigVariable & ThemeVariable }> }>;
};

export default Theme;
