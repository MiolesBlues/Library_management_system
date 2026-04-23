# Project Structure

## Main folders
- `css/` - shared and page-specific stylesheets
- `js/` - shared JavaScript files, configuration, and page-specific logic
- `pages/` - main HTML pages for the user-facing interface
- `database/` - SQL script and ERD page
- `docs/` - project notes and supporting documentation

## Pages
- `pages/index.html` - Home / Dashboard page
- `pages/books.html` - Books management page
- `pages/members.html` - Members management workspace
- `pages/loans.html` - Loans management workspace
- `pages/about.html` - About page
- `database/ERD.html` - standalone ERD diagram page

## Shared frontend files
- `css/style.css` - shared layout, responsive styles, accessibility states, branding, management workspace styles, and ERD styling
- `js/app.js` - contrast mode logic and dashboard loading logic
- `js/supabase.js` - reusable Supabase client creation helper
- `js/config.example.js` - sample configuration template for local setup
- `js/config.js` - local Supabase configuration file used during development

## Page-specific frontend files
- `css/books.css` - books page specific toolbar, table, badge, and modal styling
- `js/Books.js` - books CRUD logic
- `js/members.js` - member CRUD page logic
- `js/loans.js` - loan issue, return, and overdue tracking logic

## Database files
- `database/database_setup.sql` - creates tables, indexes, sample data, and optional reporting views
- `database/ERD.html` - renders the entity relationship diagram in the browser using Mermaid

## Current shared layout conventions
- all main pages use the same main navigation and footer pattern
- most pages use the shared LibraryMS brand block in the header
- the homepage contains dashboard summary cards wired for Supabase counts
- the members and loans pages use shared management workspace components
- the books page uses its own additional stylesheet and modal workflow
- the ERD page uses the shared stylesheet instead of inline styles
