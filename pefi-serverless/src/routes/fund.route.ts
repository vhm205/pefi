import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

import type { Bindings } from '../types/common';
import { FundService } from '../services/fund.service';

const fundSchema = z.object({
	name: z.string().min(1),
	description: z.string().optional(),
});

const router = new Hono<{ Bindings: Bindings }>();

// Create new fund
router.post('/', zValidator('json', fundSchema), async (c) => {
	try {
		const fund = await c.req.valid('json');
		const service = new FundService(c.env.DB);

		// Check if fund with same name exists
		const existing = await service.getByName(fund.name);
		if (existing) {
			return c.json({ error: 'Fund with this name already exists' }, 409);
		}

		const result = await service.create(fund);
		return c.json(result, 201);
	} catch (error) {
		return c.json({ error: (error as Error).message }, 500);
	}
});

// Get all funds with pagination
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

		const service = new FundService(c.env.DB);
		const result = await service.getAll(page, pageSize);
		return c.json(result);
	} catch (error) {
		return c.json({ error: (error as Error).message }, 500);
	}
});

// Get fund by name
router.get('/:name', async (c) => {
	try {
		const name = c.req.param('name');
		const service = new FundService(c.env.DB);
		const fund = await service.getByName(name);

		if (!fund) {
			return c.json({ error: 'Fund not found' }, 404);
		}

		return c.json(fund);
	} catch (error) {
		return c.json({ error: (error as Error).message }, 500);
	}
});

// Update fund
router.put('/:name', zValidator('json', fundSchema.partial()), async (c) => {
	try {
		const name = c.req.param('name');
		const updates = await c.req.valid('json');
		const service = new FundService(c.env.DB);

		// Check if fund exists
		const existing = await service.getByName(name);
		if (!existing) {
			return c.json({ error: 'Fund not found' }, 404);
		}

		// If name is being updated, check for duplicates
		if (updates.name && updates.name !== name) {
			const duplicateName = await service.getByName(updates.name);
			if (duplicateName) {
				return c.json({ error: 'Fund with new name already exists' }, 409);
			}
		}

		const fund = await service.update(name, updates);
		return c.json(fund);
	} catch (error) {
		return c.json({ error: (error as Error).message }, 500);
	}
});

// Delete fund
router.delete('/:name', async (c) => {
	try {
		const name = c.req.param('name');
		const service = new FundService(c.env.DB);
		const success = await service.delete(name);

		if (!success) {
			return c.json({ error: 'Fund not found' }, 404);
		}

		return c.json({ message: 'Fund deleted successfully' });
	} catch (error) {
		return c.json({ error: (error as Error).message }, 500);
	}
});

export default router;
