# Project Structure

## Main folders
- `css/` - shared stylesheet for the main site, ERD page, and management workspaces
- `js/` - shared JavaScript files, configuration, and Supabase scaffold
- `pages/` - main HTML pages for the user-facing interface
- `database/` - SQL script and ERD page
- `docs/` - project notes and supporting documentation

## Pages
- `pages/index.html` - Home / Dashboard page
- `pages/books.html` - Books page
- `pages/members.html` - Members management workspace
- `pages/loans.html` - Loans management workspace
- `pages/about.html` - About page
- `database/ERD.html` - standalone ERD diagram page

## Shared frontend files
- `css/style.css` - shared layout, responsive styles, accessibility states, branding, form/table components, management workspace styles, and ERD styling
- `js/app.js` - contrast mode logic and dashboard loading logic
- `js/supabase.js` - reusable Supabase client creation helper
- `js/config.example.js` - sample configuration template for local setup
- `js/config.js` - local Supabase configuration file used during development
- `js/members.js` - member CRUD page logic
- `js/loans.js` - loan issue, return, and overdue tracking logic

## Database files
- `database/database_setup.sql` - creates tables, indexes, sample data, and optional reporting views
- `Database_plus_policies.sql` - adds Row Level Security setup and public policies for the current frontend approach
- `database/ERD.html` - renders the entity relationship diagram in the browser using Mermaid

## Current shared layout conventions
- all main pages use the same header, navigation, and footer structure
- all main pages use the shared `css/style.css` stylesheet
- the header includes the shared LibraryMS brand block
- the homepage contains dashboard summary cards wired for Supabase counts
- the members and loans pages use shared management workspace components
- the ERD page now uses the shared stylesheet instead of inline styles
