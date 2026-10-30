import { Hono } from 'hono';
import { DBVariable } from '../db';
import { ConfigVariable } from '../config';
import { ThemeVariable } from '../theme';
import Theme from './Theme';
import IndexOf from './IndexOf';

const app = new Hono<{ Variables: DBVariable & ConfigVariable & ThemeVariable }>();
const themes: Record<string, Theme> = { IndexOf };

app.use(async (c, next) => {
	return themes[c.var.config.theme_name] ? await next() : c.text(`theme '${c.var.config.theme_name}' not found`, 404);
});

app.get('/', (c) => {
	const theme = themes[c.var.config.theme_name];

	return c.render(
		<theme.Layout c={c}>
			<theme.Main c={c} page={1} />
		</theme.Layout>,
	);
});

app.get('/pages/:page{[1-9]+}', (c) => {
	const { page } = c.req.param();
	const theme = themes[c.var.config.theme_name];

	return c.render(
		<theme.Layout c={c}>
			<theme.Main c={c} page={Number(page)} />
		</theme.Layout>,
	);
});

app.get('/:type{page|post}/:name{[a-zA-Z0-9_-]+}', (c) => {
	const { type, name } = c.req.param();
	const theme = themes[c.var.config.theme_name];

	return c.render(
		<theme.Layout c={c}>
			<theme.Page c={c} name={name} type={type as 'page' | 'post'} />
		</theme.Layout>,
	);
});

app.get('/search', (c) => {
	const { query } = c.req.query();
	const theme = themes[c.var.config.theme_name];

	if (!query) return c.redirect('/');
	return c.render(
		<theme.Layout c={c}>
			<theme.Search c={c} query={query} />
		</theme.Layout>,
	);
});

app.get('*', (c) => {
	const theme = themes[c.var.config.theme_name];

	return c.render(
		<theme.Layout c={c}>
			<theme.NotFound c={c} />
		</theme.Layout>,
	);
});

export default app;
