-- ============================================================
-- Library Management System — Database Setup Script
-- Member 2: Database Designer
-- ============================================================

-- Drop tables if they already exist (for clean re-runs)
DROP TABLE IF EXISTS loans;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS members;

-- ============================================================
-- TABLE 1: books
-- Stores information about all books in the library
-- ============================================================
CREATE TABLE books (
    book_id         SERIAL PRIMARY KEY,
    title           VARCHAR(255)  NOT NULL,
    author          VARCHAR(255)  NOT NULL,
    genre           VARCHAR(100),
    published_year  INT,
    isbn            VARCHAR(20)   UNIQUE,
    total_copies    INT           NOT NULL DEFAULT 1,
    available_copies INT          NOT NULL DEFAULT 1,
    CONSTRAINT chk_copies CHECK (available_copies >= 0 AND available_copies <= total_copies)
);

-- ============================================================
-- TABLE 2: members
-- Stores information about library members
-- ============================================================
CREATE TABLE members (
    member_id       SERIAL PRIMARY KEY,
    full_name       VARCHAR(255)  NOT NULL,
    email           VARCHAR(255)  UNIQUE NOT NULL,
    phone           VARCHAR(20),
    membership_date DATE          NOT NULL DEFAULT CURRENT_DATE
);

-- ============================================================
-- TABLE 3: loans
-- Stores records of books borrowed by members
-- ============================================================
CREATE TABLE loans (
    loan_id         SERIAL PRIMARY KEY,
    book_id         INT           NOT NULL REFERENCES books(book_id) ON DELETE RESTRICT,
    member_id       INT           NOT NULL REFERENCES members(member_id) ON DELETE RESTRICT,
    loan_date       DATE          NOT NULL DEFAULT CURRENT_DATE,
    due_date        DATE          NOT NULL,
    return_date     DATE,
    status          VARCHAR(20)   NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active', 'returned', 'overdue')),
    CONSTRAINT chk_due_date CHECK (due_date > loan_date),
    CONSTRAINT chk_return_date CHECK (return_date IS NULL OR return_date >= loan_date)
);

-- ============================================================
-- INDEXES (improve query performance)
-- ============================================================
CREATE INDEX idx_loans_book_id   ON loans(book_id);
CREATE INDEX idx_loans_member_id ON loans(member_id);
CREATE INDEX idx_loans_status    ON loans(status);

-- ============================================================
-- SAMPLE DATA — Books
-- ============================================================
INSERT INTO books (title, author, genre, published_year, isbn, total_copies, available_copies) VALUES
('The Great Gatsby',          'F. Scott Fitzgerald', 'Classic Fiction',  1925, '978-0-7432-7356-5', 3, 3),
('To Kill a Mockingbird',     'Harper Lee',          'Classic Fiction',  1960, '978-0-0609-3546-9', 2, 2),
('1984',                      'George Orwell',       'Dystopian',        1949, '978-0-4512-4523-4', 4, 3),
('The Hobbit',                'J.R.R. Tolkien',      'Fantasy',          1937, '978-0-2613-1951-0', 3, 3),
('Harry Potter and the Philosopher''s Stone', 'J.K. Rowling', 'Fantasy', 1997, '978-0-7475-3269-9', 5, 4),
('The Da Vinci Code',         'Dan Brown',           'Thriller',         2003, '978-0-3853-0416-5', 2, 2),
('Sapiens',                   'Yuval Noah Harari',   'Non-Fiction',      2011, '978-0-0624-1887-2', 3, 3),
('Atomic Habits',             'James Clear',         'Self-Help',        2018, '978-0-7352-1129-4', 4, 4),
('Pride and Prejudice',       'Jane Austen',         'Classic Fiction',  1813, '978-0-1432-0701-1', 2, 2),
('The Alchemist',             'Paulo Coelho',        'Fiction',          1988, '978-0-0618-3526-1', 3, 3);

-- ============================================================
-- SAMPLE DATA — Members
-- ============================================================
INSERT INTO members (full_name, email, phone, membership_date) VALUES
('Alice Murphy',   'alice.murphy@email.com',   '085-111-2233', '2024-01-15'),
('Brian Kelly',    'brian.kelly@email.com',    '086-222-3344', '2024-02-20'),
('Claire Walsh',   'claire.walsh@email.com',   '087-333-4455', '2024-03-10'),
('David Ryan',     'david.ryan@email.com',     '089-444-5566', '2024-04-05'),
('Emma Byrne',     'emma.byrne@email.com',     '085-555-6677', '2024-05-18'),
('Fionn O''Brien', 'fionn.obrien@email.com',   '086-666-7788', '2024-06-22'),
('Grace Doyle',    'grace.doyle@email.com',    '087-777-8899', '2024-07-30'),
('Harry Quinn',    'harry.quinn@email.com',    '083-888-9900', '2024-08-14');

-- ============================================================
-- SAMPLE DATA — Loans
-- ============================================================
INSERT INTO loans (book_id, member_id, loan_date, due_date, return_date, status) VALUES
-- Returned loans
(3,  1, '2024-09-01', '2024-09-15', '2024-09-12', 'returned'),
(5,  2, '2024-09-05', '2024-09-19', '2024-09-18', 'returned'),
(1,  3, '2024-09-10', '2024-09-24', '2024-09-22', 'returned'),

-- Active loans (currently borrowed)
(5,  4, '2024-10-01', '2024-10-15', NULL, 'active'),
(7,  5, '2024-10-03', '2024-10-17', NULL, 'active'),
(8,  6, '2024-10-05', '2024-10-19', NULL, 'active'),

-- Overdue loans
(3,  7, '2024-09-01', '2024-09-14', NULL, 'overdue'),
(6,  8, '2024-09-03', '2024-09-17', NULL, 'overdue');

-- Update available_copies to reflect active/overdue loans
UPDATE books SET available_copies = available_copies - 1 WHERE book_id IN (3, 5, 6, 7, 8);

-- ============================================================
-- USEFUL VIEWS (optional but helpful)
-- ============================================================

-- View: active loans with member and book names
CREATE OR REPLACE VIEW active_loans_view AS
SELECT
    l.loan_id,
    b.title          AS book_title,
    b.author,
    m.full_name      AS member_name,
    m.email,
    l.loan_date,
    l.due_date,
    l.status
FROM loans l
JOIN books   b ON l.book_id   = b.book_id
JOIN members m ON l.member_id = m.member_id
WHERE l.status IN ('active', 'overdue')
ORDER BY l.due_date;

-- View: overdue loans only
CREATE OR REPLACE VIEW overdue_loans_view AS
SELECT
    l.loan_id,
    b.title          AS book_title,
    m.full_name      AS member_name,
    m.email,
    l.loan_date,
    l.due_date,
    CURRENT_DATE - l.due_date AS days_overdue
FROM loans l
JOIN books   b ON l.book_id   = b.book_id
JOIN members m ON l.member_id = m.member_id
WHERE l.status = 'overdue'
ORDER BY days_overdue DESC;

-- ============================================================
-- END OF SETUP SCRIPT
-- ============================================================
