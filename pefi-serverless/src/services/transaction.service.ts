import { D1Database } from '@cloudflare/workers-types';
import { getDateNow } from '../utils/utils';
import { TransactionMethod, TransactionType } from '../enums/transaction.enum';

export interface Transaction {
	id: string;
	type: 'income' | 'expense' | 'transfer';
	date: string;
	description: string;
	amount: number;
	note?: string;
	category?: string;
	method?: string;
	fund?: string;
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

export class TransactionService {
	constructor(private db: D1Database) {}

	async create(transaction: Partial<Transaction>): Promise<Transaction> {
		const query = `
      INSERT INTO transactions (type, date, description, amount, note, category, method, fund)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `;

		const params = [
			transaction.type || TransactionType.EXPENSE,
			transaction.date || getDateNow(),
			transaction.description || '',
			transaction.amount,
			transaction.note || '',
			transaction.category || '',
			transaction.method || TransactionMethod.TRANSFER,
			transaction.fund || '',
		];

		const result = await this.db
			.prepare(query)
			.bind(...params)
			.first();
		if (!result) throw new Error('Failed to create transaction');

		return result as unknown as Transaction;
	}

	async getAll(page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<Transaction>> {
		// Calculate offset
		const offset = (page - 1) * pageSize;

		// Get total count
		const countResult = await this.db.prepare('SELECT COUNT(*) as total FROM transactions').first();
		const total = (countResult?.total as number) || 0;

		// Get paginated data
		const query = `
			SELECT * FROM transactions
			ORDER BY date DESC
			LIMIT ? OFFSET ?
		`;

		const { results } = await this.db.prepare(query).bind(pageSize, offset).all();

		return {
			data: results as unknown as Transaction[],
			pagination: {
				total,
				page,
				pageSize,
				totalPages: Math.ceil(total / pageSize),
			},
		};
	}

	async getById(id: string): Promise<Transaction | null> {
		const query = 'SELECT * FROM transactions WHERE id = ?';
		const result = await this.db.prepare(query).bind(id).first();
		return result ? (result as unknown as Transaction) : null;
	}

	async update(id: string, transaction: Partial<Transaction>): Promise<Transaction | null> {
		const current = await this.getById(id);
		if (!current) return null;

		const updates: string[] = [];
		const params: (string | number | undefined)[] = [];

		Object.entries(transaction).forEach(([key, value]) => {
			if (value !== undefined && key !== 'id') {
				updates.push(`${key} = ?`);
				params.push(value);
			}
		});

		if (updates.length === 0) return current;

		params.push(id);
		const query = `
      UPDATE transactions 
      SET ${updates.join(', ')}
      WHERE id = ?
      RETURNING *
    `;

		const result = await this.db
			.prepare(query)
			.bind(...params)
			.first();
		return result ? (result as unknown as Transaction) : null;
	}

	async delete(id: string): Promise<boolean> {
		const query = 'DELETE FROM transactions WHERE id = ? RETURNING id';
		const result = await this.db.prepare(query).bind(id).first();
		return result !== null;
	}
}
