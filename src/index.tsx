import { Hono } from 'hono';
import { renderer } from './renderer';
import db, { DBVariable } from './db';
import config, { ConfigVariable } from './config';
import theme, { ThemeVariable } from './theme';

const app = new Hono<{ Variables: DBVariable & ConfigVariable & ThemeVariable }>();
app.use(db);
app.use(config);
app.use(theme);
app.use(renderer);

app.get('/', (c) => {
	return c.render(<h1>Hello!</h1>);
});

export default app;
