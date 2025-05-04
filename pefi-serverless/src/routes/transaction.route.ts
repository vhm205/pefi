import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

import type { Bindings } from '../types/common';
import { TransactionService } from '../services/transaction.service';

const transactionSchema = z.object({
	type: z.enum(['income', 'expense', 'transfer']),
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
	description: z.string(),
	amount: z.number().positive(),
	note: z.string().optional(),
	category: z.string().optional(),
	method: z.string().optional(),
	fund: z.string().optional(),
});

const router = new Hono<{ Bindings: Bindings }>();

router.post('/', zValidator('json', transactionSchema.partial()), async (c) => {
	try {
		const transaction = await c.req.valid('json');
		const service = new TransactionService(c.env.DB);
		const result = await service.create(transaction);
		return c.json(result, 201);
	} catch (error) {
		return c.json({ error: (error as Error).message }, 500);
	}
});

router.get('/', async (c) => {
	try {
		const page = parseInt(c.req.query('page') || '1');
		const pageSize = parseInt(c.req.query('pageSize') || '10');

		// Validate pagination parameters
		if (isNaN(page) || page < 1) {
			return c.json({ error: 'Invalid page parameter' }, 400);
		}
		if (isNaN(pageSize) || pageSize < 1 || pageSize > 100) {
			return c.json({ error: 'Invalid pageSize parameter' }, 400);
		}

		const service = new TransactionService(c.env.DB);
		const result = await service.getAll(page, pageSize);
		return c.json(result);
	} catch (error) {
		return c.json({ error: (error as Error).message }, 500);
	}
});

router.get('/:id', async (c) => {
	try {
		const id = c.req.param('id');
		const service = new TransactionService(c.env.DB);
		const transaction = await service.getById(id);

		if (!transaction) {
			return c.json({ error: 'Transaction not found' }, 404);
		}

		return c.json(transaction);
	} catch (error) {
		return c.json({ error: (error as Error).message }, 500);
	}
});

router.put('/:id', zValidator('json', transactionSchema.partial()), async (c) => {
	try {
		const id = c.req.param('id');
		const updates = await c.req.valid('json');
		const service = new TransactionService(c.env.DB);
		const transaction = await service.update(id, updates);

		if (!transaction) {
			return c.json({ error: 'Transaction not found' }, 404);
		}

		return c.json(transaction);
	} catch (error) {
		return c.json({ error: (error as Error).message }, 500);
	}
});

router.delete('/:id', async (c) => {
	try {
		const id = c.req.param('id');
		const service = new TransactionService(c.env.DB);
		const success = await service.delete(id);

		if (!success) {
			return c.json({ error: 'Transaction not found' }, 404);
		}

		return c.json({ message: 'Transaction deleted successfully' });
	} catch (error) {
		return c.json({ error: (error as Error).message }, 500);
	}
});

export default router;
