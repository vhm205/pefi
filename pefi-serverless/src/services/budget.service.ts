import { D1Database } from '@cloudflare/workers-types';

export interface Budget {
	id: string;
	name: string;
	amount: number;
	spent: number;
	start_date: string;
	end_date: string;
	status: 'Active' | 'Inactive' | 'Completed';
	note?: string;
	category?: string;
	fund?: string;
}

export class BudgetService {
	constructor(private db: D1Database) {}

	async create(budget: Omit<Budget, 'id'>): Promise<Budget> {
		const query = `
			INSERT INTO budgets (name, amount, spent, start_date, end_date, status, note, category, fund)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
			RETURNING *
		`;

		const params = [
			budget.name,
			budget.amount,
			budget.spent,
			budget.start_date,
			budget.end_date,
			budget.status,
			budget.note,
			budget.category,
			budget.fund,
		];

		const result = await this.db
			.prepare(query)
			.bind(...params)
			.first();
		if (!result) throw new Error('Failed to create budget');
		return result as unknown as Budget;
	}

	async getAll(): Promise<Budget[]> {
		const query = 'SELECT * FROM budgets ORDER BY start_date DESC';
		const { results } = await this.db.prepare(query).all();
		return results as unknown as Budget[];
	}

	async getById(id: string): Promise<Budget | null> {
		const query = 'SELECT * FROM budgets WHERE id = ?';
		const result = await this.db.prepare(query).bind(id).first();
		return result ? (result as unknown as Budget) : null;
	}

	async update(id: string, budget: Partial<Budget>): Promise<Budget | null> {
		const current = await this.getById(id);
		if (!current) return null;

		const updates: string[] = [];
		const params: (string | number | undefined)[] = [];

		Object.entries(budget).forEach(([key, value]) => {
			if (value !== undefined && key !== 'id') {
				updates.push(`${key} = ?`);
				params.push(value);
			}
		});

		if (updates.length === 0) return current;

		params.push(id);
		const query = `
			UPDATE budgets 
			SET ${updates.join(', ')}
			WHERE id = ?
			RETURNING *
		`;

		const result = await this.db
			.prepare(query)
			.bind(...params)
			.first();
		return result ? (result as unknown as Budget) : null;
	}

	async delete(id: string): Promise<boolean> {
		const query = 'DELETE FROM budgets WHERE id = ? RETURNING id';
		const result = await this.db.prepare(query).bind(id).first();
		return result !== null;
	}
}
