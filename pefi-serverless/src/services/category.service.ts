import { D1Database } from '@cloudflare/workers-types';

export interface Category {
	name: string;
	type: 'income' | 'expense';
}

interface PaginatedResponse<T> {
	data: T[];
	pagination: {
		total: number;
		page: number;
		pageSize: number;
		totalPages: number;
	};
}

export class CategoryService {
	constructor(private db: D1Database) {}

	async create(category: Category): Promise<Category> {
		const query = `
            INSERT INTO categories (name, type)
            VALUES (?, ?)
            RETURNING *
        `;

		const result = await this.db.prepare(query).bind(category.name, category.type).first();

		if (!result) throw new Error('Failed to create category');
		return result as unknown as Category;
	}

	async getAll(page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<Category>> {
		const offset = (page - 1) * pageSize;
		const countResult = await this.db.prepare('SELECT COUNT(*) as total FROM categories').first();
		const total = (countResult?.total as number) || 0;

		const query = `
			SELECT * FROM categories
			ORDER BY name ASC
			LIMIT ? OFFSET ?
		`;

		const { results } = await this.db.prepare(query).bind(pageSize, offset).all();

		return {
			data: results as unknown as Category[],
			pagination: {
				total,
				page,
				pageSize,
				totalPages: Math.ceil(total / pageSize),
			},
		};
	}

	async getByType(type: 'income' | 'expense'): Promise<Category[]> {
		const query = `
			SELECT * FROM categories
			WHERE type = ?
			ORDER BY name ASC
		`;

		const { results } = await this.db.prepare(query).bind(type).all();
		return results as unknown as Category[];
	}

	async getByName(name: string): Promise<Category | null> {
		const query = 'SELECT * FROM categories WHERE name = ?';
		const result = await this.db.prepare(query).bind(name).first();
		return result ? (result as unknown as Category) : null;
	}

	async update(oldName: string, category: Partial<Category>): Promise<Category | null> {
		const current = await this.getByName(oldName);
		if (!current) return null;

		const updates: string[] = [];
		const params: (string | 'income' | 'expense')[] = [];

		Object.entries(category).forEach(([key, value]) => {
			if (value !== undefined) {
				updates.push(`${key} = ?`);
				params.push(value);
			}
		});

		if (updates.length === 0) return current;

		params.push(oldName);
		const query = `
			UPDATE categories 
			SET ${updates.join(', ')}
			WHERE name = ?
			RETURNING *
		`;

		const result = await this.db
			.prepare(query)
			.bind(...params)
			.first();
		return result ? (result as unknown as Category) : null;
	}

	async delete(name: string): Promise<boolean> {
		const query = 'DELETE FROM categories WHERE name = ? RETURNING name';
		const result = await this.db.prepare(query).bind(name).first();
		return result !== null;
	}
}
