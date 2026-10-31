import { Hono } from 'hono';
import { DBVariable } from '../../db';
import { ConfigVariable } from '../../config';
import { ThemeVariable } from '../../theme';
import needauth from '../needauth';

const app = new Hono<{ Variables: DBVariable & ConfigVariable & ThemeVariable }>();
app.use(needauth);

app.get('/', (c) => {
	return c.render(<h1>dashboard</h1>);
});

export default app;
