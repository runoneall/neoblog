import { Hono } from 'hono';
import { renderer } from './renderer';
import db, { DBVariable } from './db';
import config, { ConfigVariable } from './config';
import theme, { ThemeVariable } from './theme';
import admin from './admin';
import themes from './themes';

const app = new Hono<{ Variables: DBVariable & ConfigVariable & ThemeVariable }>();
app.use(db);
app.use(config);
app.use(theme);
app.use(renderer);

app.route('/admin', admin);
app.route('/', themes);

export default app;
