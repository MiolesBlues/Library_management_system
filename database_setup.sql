-- ============================================================
-- Library Management System
-- Database Setup Script
-- Module: WADT H1002
-- Created by: Member 2
-- ============================================================

-- This script creates all three tables for the Library Management System.
-- The tables are: Books, Members, and Loans.
-- Run this script in Supabase using the SQL Editor.

-- ============================================================
-- Drop tables if they already exist (for re-running the script)
-- We drop Loans first because it depends on Books and Members
-- ============================================================

DROP TABLE IF EXISTS loans   CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS books   CASCADE;

-- ============================================================
-- Table 1: Books
-- Stores information about all books in the library
-- CHECK constraints ensure copy counts cannot go negative
-- ============================================================

CREATE TABLE books (
    book_id          SERIAL       PRIMARY KEY,
    title            VARCHAR(255) NOT NULL,
    author           VARCHAR(255) NOT NULL,
    genre            VARCHAR(100),
    published_year   INT,
    isbn             VARCHAR(20)  UNIQUE,
    total_copies     INT          NOT NULL DEFAULT 1 CHECK (total_copies     >= 0),
    available_copies INT          NOT NULL DEFAULT 1 CHECK (available_copies >= 0)
);

-- ============================================================
-- Table 2: Members
-- Stores information about library members
-- ============================================================

CREATE TABLE members (
    member_id       SERIAL       PRIMARY KEY,
    full_name       VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL UNIQUE,
    phone           VARCHAR(20),
    membership_date DATE         NOT NULL DEFAULT CURRENT_DATE
);

-- ============================================================
-- Table 3: Loans
-- Stores records of books borrowed by members
-- book_id   links to the Books   table (Foreign Key)
-- member_id links to the Members table (Foreign Key)
-- status must be one of: 'active', 'returned', 'overdue'
-- return_date is NULL until the book is handed back
-- ============================================================

CREATE TABLE loans (
    loan_id     SERIAL      PRIMARY KEY,
    book_id     INT         NOT NULL REFERENCES books(book_id)     ON DELETE CASCADE,
    member_id   INT         NOT NULL REFERENCES members(member_id) ON DELETE CASCADE,
    loan_date   DATE        NOT NULL DEFAULT CURRENT_DATE,
    due_date    DATE        NOT NULL,
    return_date DATE,                -- NULL means the book has not been returned yet
    status      VARCHAR(20) NOT NULL DEFAULT 'active'
                CHECK (status IN ('active', 'returned', 'overdue'))
);

-- ============================================================
-- Indexes
-- Speed up queries that filter by book, member, or loan status
-- ============================================================

CREATE INDEX idx_loans_book_id   ON loans(book_id);
CREATE INDEX idx_loans_member_id ON loans(member_id);
CREATE INDEX idx_loans_status    ON loans(status);

-- ============================================================
-- Sample Data: Books
-- Adding 8 test books across a range of genres
-- available_copies is lower than total_copies for books on loan
-- ============================================================

INSERT INTO books (title, author, genre, published_year, isbn, total_copies, available_copies)
VALUES
    ('To Kill a Mockingbird',                   'Harper Lee',          'Fiction',     1960, '978-0061935466', 3, 2),
    ('1984',                                    'George Orwell',       'Dystopian',   1949, '978-0451524935', 2, 2),
    ('The Great Gatsby',                        'F. Scott Fitzgerald', 'Classic',     1925, '978-0743273565', 2, 1),
    ('Harry Potter and the Philosophers Stone', 'J.K. Rowling',        'Fantasy',     1997, '978-0747532699', 4, 3),
    ('The Hobbit',                              'J.R.R. Tolkien',      'Fantasy',     1937, '978-0547928227', 2, 2),
    ('Atomic Habits',                           'James Clear',         'Self-Help',   2018, '978-0735211292', 3, 2),
    ('Sapiens',                                 'Yuval Noah Harari',   'Non-Fiction', 2011, '978-0062316097', 2, 1),
    ('The Alchemist',                           'Paulo Coelho',        'Fiction',     1988, '978-0062315007', 3, 3);

-- ============================================================
-- Sample Data: Members
-- Adding 5 test members to the database
-- ============================================================

INSERT INTO members (full_name, email, phone, membership_date)
VALUES
    ('Alice Murphy',  'alice.murphy@email.com',  '087-1234567', '2024-09-01'),
    ('Brian Walsh',   'brian.walsh@email.com',   '086-9876543', '2024-09-15'),
    ('Claire Kelly',  'claire.kelly@email.com',  '085-5551234', '2024-10-01'),
    ('David OBrien',  'david.obrien@email.com',  '083-7778899', '2025-01-10'),
    ('Emma Doyle',    'emma.doyle@email.com',    '087-3334455', '2025-02-20');

-- ============================================================
-- Sample Data: Loans
-- 8 records covering all three statuses:
--   active   = borrowed, due date in the future
--   overdue  = borrowed, due date already passed, not returned
--   returned = returned, return_date filled in
-- This ensures all pages of the app have data to display
-- ============================================================

INSERT INTO loans (book_id, member_id, loan_date, due_date, return_date, status)
VALUES
    (3, 1, '2025-04-01', '2025-04-15', NULL,         'overdue'),   -- Alice:  The Great Gatsby,   overdue
    (4, 2, '2025-04-10', '2025-04-24', NULL,         'active'),    -- Brian:  Harry Potter,        active
    (6, 3, '2025-03-20', '2025-04-03', '2025-04-02', 'returned'),  -- Claire: Atomic Habits,       returned
    (6, 4, '2025-04-15', '2025-04-29', NULL,         'active'),    -- David:  Atomic Habits,       active
    (1, 5, '2025-03-25', '2025-04-08', NULL,         'overdue'),   -- Emma:   To Kill a Mockingbird, overdue
    (7, 1, '2025-04-12', '2025-04-26', NULL,         'active'),    -- Alice:  Sapiens,             active
    (4, 3, '2025-03-01', '2025-03-15', '2025-03-14', 'returned'),  -- Claire: Harry Potter,        returned
    (5, 2, '2025-04-18', '2025-05-02', NULL,         'active');    -- Brian:  The Hobbit,          active

-- ============================================================
-- Views (optional but recommended for the frontend)
-- These can be queried from JavaScript just like regular tables
-- ============================================================

-- Active and overdue loans with book title + member name joined in
CREATE OR REPLACE VIEW v_active_loans AS
SELECT
    l.loan_id,
    b.title       AS book_title,
    m.full_name   AS member_name,
    l.loan_date,
    l.due_date,
    l.status
FROM loans l
JOIN books   b ON l.book_id   = b.book_id
JOIN members m ON l.member_id = m.member_id
WHERE l.status IN ('active', 'overdue');

-- Overdue loans only, with days overdue calculated
CREATE OR REPLACE VIEW v_overdue_loans AS
SELECT
    l.loan_id,
    b.title                          AS book_title,
    m.full_name                      AS member_name,
    m.email                          AS member_email,
    l.due_date,
    (CURRENT_DATE - l.due_date)      AS days_overdue
FROM loans l
JOIN books   b ON l.book_id   = b.book_id
JOIN members m ON l.member_id = m.member_id
WHERE l.status = 'overdue';

-- Dashboard summary counts (one row, four numbers)
CREATE OR REPLACE VIEW v_dashboard_summary AS
SELECT
    (SELECT COUNT(*) FROM books)                          AS total_books,
    (SELECT COUNT(*) FROM members)                        AS total_members,
    (SELECT COUNT(*) FROM loans WHERE status = 'active')  AS active_loans,
    (SELECT COUNT(*) FROM loans WHERE status = 'overdue') AS overdue_loans;

-- ============================================================
-- End of Script
-- ============================================================
