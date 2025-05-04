import { Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { cors } from 'hono/cors';

import type { Bindings } from './types/common';
import { TransactionMethod } from './enums/transaction.enum';

import transactionRouter from './routes/transaction.route';
import budgetRouter from './routes/budget.route';
import categoryRouter from './routes/category.route';
import fundRouter from './routes/fund.route';

const app = new Hono<{ Bindings: Bindings }>();

app.use(
	'*',
	cors({
		origin: ['http://localhost:5173', 'https://fipe-f4d.pages.dev', 'https://pefi-ahm.pages.dev'],
		allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowHeaders: ['Content-Type', 'Authorization'],
		exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
		maxAge: 600,
		credentials: true,
	}),
	prettyJSON(),
	logger(),
	async (c, next) => {
		const auth = bearerAuth({ token: c.env.API_KEY });
		return auth(c, next);
	}
);

app.get('/api/methods', async (c) => {
	try {
		const methods = Object.values(TransactionMethod);
		return c.json(methods);
	} catch (error) {
		return c.json({ error: (error as Error).message }, 500);
	}
});

app.route('/api/funds', fundRouter);
app.route('/api/categories', categoryRouter);
app.route('/api/transactions', transactionRouter);
app.route('/api/budgets', budgetRouter);

export default app;
