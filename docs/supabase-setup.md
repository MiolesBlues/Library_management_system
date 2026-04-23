# Supabase Setup Guide

## Purpose
This project uses Supabase as the database platform for storing books, members, and loans data.

## Files
- `js/config.example.js` - example configuration file
- `js/config.js` - local development configuration file
- `js/supabase.js` - shared Supabase client scaffold
- `js/Books.js` - books page specific Supabase logic
- `database/database_setup.sql` - SQL setup script for tables, sample data, and optional views

## Team Setup Steps
1. Copy `js/config.example.js`
2. Save the copy as `js/config.js`
3. Replace the placeholder values with the real Supabase project URL and anon key
4. Make sure the project URL uses the base Supabase domain, for example `https://your-project.supabase.co`, not the `/rest/v1/` endpoint
5. Run `database/database_setup.sql` in the Supabase SQL Editor
6. Open `pages/index.html` in the browser and confirm the dashboard can load counts
7. Open the books, members, and loans pages and confirm the CRUD-connected screens can load their data

## Frontend Integration
The Supabase JavaScript client should be loaded before any script that creates a client.

### Shared pattern used by the dashboard, members page, and loans page
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="../js/config.js"></script>
<script src="../js/supabase.js"></script>
```

### Books page current pattern
The books page currently loads Supabase directly in `js/Books.js` instead of using the shared helper.
This works as long as the script contains correct values, but it should be aligned with the shared project setup later.

## Current dashboard queries
The current dashboard logic in `js/app.js` reads direct counts from:
- `books`
- `members`
- `loans` filtered by `status = 'active'`
- `loans` filtered by `status = 'overdue'`

## Current page queries
- `js/Books.js` reads and writes records in `books`
- `js/members.js` reads and writes records in `members`
- `js/loans.js` reads and writes records in `loans`, and also reads `books` and `members` for loan creation

## Optional SQL views
The SQL views in `database/database_setup.sql` can be useful for later reporting pages:
- `v_active_loans`
- `v_overdue_loans`
- `v_dashboard_summary`

## Notes
- Only use the public anon key on the frontend
- Do not store service role keys in the browser
- If the configuration is missing, the shared client scaffold safely returns `null`
- Do not commit `js/config.js` if it contains real project credentials
- For long-term maintainability, align the books page with the same shared Supabase configuration approach used by the dashboard, members page, and loans page
