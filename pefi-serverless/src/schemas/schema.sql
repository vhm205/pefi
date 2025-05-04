-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- Create tables
CREATE TABLE IF NOT EXISTS categories (
    name TEXT PRIMARY KEY,
    type TEXT CHECK(type IN ('income', 'expense')) NOT NULL
);

CREATE TABLE IF NOT EXISTS funds (
    name TEXT PRIMARY KEY,
    description TEXT
);

CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-7' || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(6)))),
    type TEXT CHECK(type IN ('income', 'expense', 'transfer')) NOT NULL,
    date TEXT NOT NULL,
    description TEXT,
    amount DECIMAL(10,2) NOT NULL,
    note TEXT,
    method TEXT,
    category TEXT,
    fund TEXT,
    FOREIGN KEY (category) REFERENCES categories(name) ON DELETE SET NULL,
    FOREIGN KEY (fund) REFERENCES funds(name) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS budgets (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-7' || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(6)))),
    name TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    spent DECIMAL(10,2) DEFAULT 0,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    status TEXT CHECK(status IN ('Active', 'Inactive', 'Completed')) NOT NULL DEFAULT 'Active',
    note TEXT,
    category TEXT,
    fund TEXT,
    FOREIGN KEY (category) REFERENCES categories(name) ON DELETE SET NULL,
    FOREIGN KEY (fund) REFERENCES funds(name) ON DELETE SET NULL
);
