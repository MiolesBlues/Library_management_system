# Supabase Setup Guide

## Purpose
This project uses Supabase as the database platform for storing books, members, and loans data.

## Files
- `js/config.example.js` - example configuration file
- `js/config.js` - local development configuration file
- `js/supabase.js` - Supabase client scaffold
- `database/database_setup.sql` - SQL setup script for tables, sample data, and optional views

## Team Setup Steps
1. Copy `js/config.example.js`
2. Save the copy as `js/config.js`
3. Replace the placeholder values with the real Supabase project URL and anon key
4. Run `database/database_setup.sql` in the Supabase SQL Editor
5. Open `pages/index.html` in the browser and confirm the dashboard can load counts

## Frontend Integration
The Supabase JavaScript client should be loaded before `js/supabase.js` on any page that needs database access.

Example CDN:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="../js/config.js"></script>
<script src="../js/supabase.js"></script>
```

## Current dashboard queries
The current dashboard logic in `js/app.js` reads direct counts from:
- `books`
- `members`
- `loans` filtered by `status = 'active'`
- `loans` filtered by `status = 'overdue'`

The optional SQL views in `database/database_setup.sql` can still be useful for later reporting pages:
- `v_active_loans`
- `v_overdue_loans`
- `v_dashboard_summary`

## Notes
- Only use the public anon key on the frontend
- Do not store service role keys in the browser
- If the configuration is missing, the client scaffold safely returns `null`
- Do not commit `js/config.js` if it contains real project credentials
