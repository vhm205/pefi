import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

import type { Bindings } from '../types/common';
import { CategoryService } from '../services/category.service';

const categorySchema = z.object({
	name: z.string().min(1),
	type: z.enum(['income', 'expense']),
});

const router = new Hono<{ Bindings: Bindings }>();

// Create new category
router.post('/', zValidator('json', categorySchema), async (c) => {
	try {
		const category = await c.req.valid('json');
		const service = new CategoryService(c.env.DB);

		// Check if category already exists
		const existing = await service.getByName(category.name);
		if (existing) {
			return c.json({ error: 'Category already exists' }, 409);
		}

		const result = await service.create(category);
		return c.json(result, 201);
	} catch (error) {
		return c.json({ error: (error as Error).message }, 500);
	}
});

// Get all categories with pagination
router.get('/', async (c) => {
	try {
		const page = parseInt(c.req.query('page') || '1');
		const pageSize = parseInt(c.req.query('pageSize') || '10');

		if (isNaN(page) || page < 1) {
			return c.json({ error: 'Invalid page parameter' }, 400);
		}
		if (isNaN(pageSize) || pageSize < 1 || pageSize > 100) {
			return c.json({ error: 'Invalid pageSize parameter' }, 400);
		}

		const service = new CategoryService(c.env.DB);
		const result = await service.getAll(page, pageSize);
		return c.json(result);
	} catch (error) {
		return c.json({ error: (error as Error).message }, 500);
	}
});

// Get categories by type
router.get('/type/:type', async (c) => {
	try {
		const type = c.req.param('type');
		if (type !== 'income' && type !== 'expense') {
			return c.json({ error: 'Invalid type parameter' }, 400);
		}

		const service = new CategoryService(c.env.DB);
		const categories = await service.getByType(type);
		return c.json(categories);
	} catch (error) {
		return c.json({ error: (error as Error).message }, 500);
	}
});

// Get category by name
router.get('/:name', async (c) => {
	try {
		const name = c.req.param('name');
		const service = new CategoryService(c.env.DB);
		const category = await service.getByName(name);

		if (!category) {
			return c.json({ error: 'Category not found' }, 404);
		}

		return c.json(category);
	} catch (error) {
		return c.json({ error: (error as Error).message }, 500);
	}
});

// Update category
router.put('/:name', zValidator('json', categorySchema.partial()), async (c) => {
	try {
		const oldName = c.req.param('name');
		const updates = await c.req.valid('json');
		const service = new CategoryService(c.env.DB);

		// Check if old category exists
		const existing = await service.getByName(oldName);
		if (!existing) {
			return c.json({ error: 'Category not found' }, 404);
		}

		// Check if new name already exists (if name is being updated)
		if (updates.name && updates.name !== oldName) {
			const existingNew = await service.getByName(updates.name);
			if (existingNew) {
				return c.json({ error: 'Category with new name already exists' }, 409);
			}
		}

		const category = await service.update(oldName, updates);
		return c.json(category);
	} catch (error) {
		return c.json({ error: (error as Error).message }, 500);
	}
});

// Delete category
router.delete('/:name', async (c) => {
	try {
		const name = c.req.param('name');
		const service = new CategoryService(c.env.DB);
		const success = await service.delete(name);

		if (!success) {
			return c.json({ error: 'Category not found' }, 404);
		}

		return c.json({ message: 'Category deleted successfully' });
	} catch (error) {
		return c.json({ error: (error as Error).message }, 500);
	}
});

export default router;
