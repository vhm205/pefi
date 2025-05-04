import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

import type { Bindings } from '../types/common';
import { BudgetService } from '../services/budget.service';

const budgetSchema = z.object({
	name: z.string(),
	amount: z.number().positive(),
	spent: z.number().default(0),
	start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	status: z.enum(['Active', 'Inactive', 'Completed']).default('Active'),
	note: z.string().optional(),
	category: z.string().optional(),
	fund: z.string().optional(),
});

const router = new Hono<{ Bindings: Bindings }>();

router.post('/', zValidator('json', budgetSchema), async (c) => {
	try {
		const budget = await c.req.valid('json');
		const service = new BudgetService(c.env.DB);
		const result = await service.create(budget);
		return c.json(result, 201);
	} catch (error) {
		return c.json({ error: (error as Error).message }, 500);
	}
});

router.get('/', async (c) => {
	try {
		const service = new BudgetService(c.env.DB);
		const budgets = await service.getAll();
		return c.json(budgets);
	} catch (error) {
		return c.json({ error: (error as Error).message }, 500);
	}
});

router.get('/:id', async (c) => {
	try {
		const id = c.req.param('id');
		const service = new BudgetService(c.env.DB);
		const budget = await service.getById(id);

		if (!budget) {
			return c.json({ error: 'Budget not found' }, 404);
		}

		return c.json(budget);
	} catch (error) {
		return c.json({ error: (error as Error).message }, 500);
	}
});

router.put('/:id', zValidator('json', budgetSchema.partial()), async (c) => {
	try {
		const id = c.req.param('id');
		const updates = await c.req.valid('json');
		const service = new BudgetService(c.env.DB);
		const budget = await service.update(id, updates);

		if (!budget) {
			return c.json({ error: 'Budget not found' }, 404);
		}

		return c.json(budget);
	} catch (error) {
		return c.json({ error: (error as Error).message }, 500);
	}
});

router.delete('/:id', async (c) => {
	try {
		const id = c.req.param('id');
		const service = new BudgetService(c.env.DB);
		const success = await service.delete(id);

		if (!success) {
			return c.json({ error: 'Budget not found' }, 404);
		}

		return c.json({ message: 'Budget deleted successfully' });
	} catch (error) {
		return c.json({ error: (error as Error).message }, 500);
	}
});

export default router;
