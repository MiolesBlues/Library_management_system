# Supabase Setup Guide

## Purpose
This project uses Supabase as the database platform for storing books, members, and loans data.

## Files
- `js/config.example.js` - example configuration file
- `js/supabase.js` - Supabase client scaffold

## Team Setup Steps
1. Copy `js/config.example.js`
2. Save the copy as `js/config.js`
3. Replace the placeholder values with the real Supabase project URL and anon key
4. Make sure `js/config.js` is not committed if it contains real project credentials

## Frontend Integration
The Supabase JavaScript client should be loaded before `js/supabase.js` on any page that needs database access.

Example CDN:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="../js/config.js"></script>
<script src="../js/supabase.js"></script>
```

## Notes
- Only use the public anon key on the frontend
- Do not store service role keys in the browser
- If the configuration is missing, the client scaffold safely returns `null`
