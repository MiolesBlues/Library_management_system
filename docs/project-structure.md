# Project Structure

## Main folders
- `css/` - shared stylesheet for the main site and ERD page
- `js/` - shared JavaScript files, configuration, and Supabase scaffold
- `pages/` - main HTML pages for the user-facing interface
- `database/` - SQL script and ERD page
- `docs/` - project notes and supporting documentation

## Pages
- `pages/index.html` - Home / Dashboard page
- `pages/books.html` - Books page
- `pages/members.html` - Members page
- `pages/loans.html` - Loans page
- `pages/about.html` - About page
- `database/ERD.html` - standalone ERD diagram page

## Shared frontend files
- `css/style.css` - shared layout, responsive styles, accessibility states, branding, and ERD styling
- `js/app.js` - contrast mode logic and dashboard loading logic
- `js/supabase.js` - reusable Supabase client creation helper
- `js/config.example.js` - sample configuration template for local setup
- `js/config.js` - local Supabase configuration file used during development

## Database files
- `database/database_setup.sql` - creates tables, indexes, sample data, and optional reporting views
- `database/ERD.html` - renders the entity relationship diagram in the browser using Mermaid

## Current shared layout conventions
- all main pages use the same header, navigation, and footer structure
- all main pages use the shared `css/style.css` stylesheet
- the header includes the shared LibraryMS brand block
- the homepage contains dashboard summary cards wired for Supabase counts
- the ERD page now uses the shared stylesheet instead of inline styles
