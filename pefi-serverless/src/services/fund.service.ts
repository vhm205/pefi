import { D1Database } from '@cloudflare/workers-types';

export interface Fund {
	name: string;
	description?: string;
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

export class FundService {
	constructor(private db: D1Database) {}

	async create(fund: Fund): Promise<Fund> {
		const query = `
            INSERT INTO funds (name, description)
            VALUES (?, ?)
            RETURNING *
        `;

		const result = await this.db.prepare(query).bind(fund.name, fund.description).first();

		if (!result) throw new Error('Failed to create fund');
		return result as unknown as Fund;
	}

	async getAll(page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<Fund>> {
		// Calculate offset
		const offset = (page - 1) * pageSize;

		// Get total count
		const countResult = await this.db.prepare('SELECT COUNT(*) as total FROM funds').first();
		const total = (countResult?.total as number) || 0;

		// Get paginated data
		const query = `
            SELECT * FROM funds
            ORDER BY name ASC
            LIMIT ? OFFSET ?
        `;

		const { results } = await this.db.prepare(query).bind(pageSize, offset).all();

		return {
			data: results as unknown as Fund[],
			pagination: {
				total,
				page,
				pageSize,
				totalPages: Math.ceil(total / pageSize),
			},
		};
	}

	async getByName(name: string): Promise<Fund | null> {
		const query = 'SELECT * FROM funds WHERE name = ?';
		const result = await this.db.prepare(query).bind(name).first();
		return result ? (result as unknown as Fund) : null;
	}

	async update(oldName: string, fund: Partial<Fund>): Promise<Fund | null> {
		const current = await this.getByName(oldName);
		if (!current) return null;

		const updates: string[] = [];
		const params: string[] = [];

		// Build dynamic update query
		Object.entries(fund).forEach(([key, value]) => {
			if (value !== undefined) {
				updates.push(`${key} = ?`);
				params.push(value);
			}
		});

		if (updates.length === 0) return current;

		params.push(oldName);
		const query = `
            UPDATE funds
            SET ${updates.join(', ')}
            WHERE name = ?
            RETURNING *
        `;

		const result = await this.db
			.prepare(query)
			.bind(...params)
			.first();
		return result ? (result as unknown as Fund) : null;
	}

	async delete(name: string): Promise<boolean> {
		const query = 'DELETE FROM funds WHERE name = ? RETURNING name';
		const result = await this.db.prepare(query).bind(name).first();
		return result !== null;
	}
}
