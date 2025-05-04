-- Categories
INSERT OR IGNORE INTO categories (name, type) VALUES
    ('Lương', 'income'),
    ('Làm thêm', 'income'),
    ('MMO', 'income'),
    ('Thưởng', 'income'),
    ('Đầu tư', 'income'),
    ('Tiết kiệm', 'expense'),
    ('Nhà ở', 'expense'),
    ('Đồ ăn', 'expense'),
    ('Tiện ích', 'expense'),
    ('Bảo hiểm', 'expense'),
    ('Sức khỏe', 'expense'),
    ('Cá nhân', 'expense'),
    ('Giải trí', 'expense'),
    ('Khác', 'expense');

-- Funds
INSERT OR IGNORE INTO funds (name) VALUES
    ('Cá nhân'),
    ('Bảo hiểm'),
    ('Đầu tư'),
    ('Tiết kiệm');