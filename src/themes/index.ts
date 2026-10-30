import { Hono } from 'hono';
import { DBVariable } from '../db';
import { ConfigVariable } from '../config';
import { ThemeVariable } from '../theme';

const app = new Hono<{ Variables: DBVariable & ConfigVariable & ThemeVariable }>();

export default app;
