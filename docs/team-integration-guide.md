# Team Integration Guide

## Purpose
This guide explains how each team member should continue development inside the shared project structure without breaking the existing layout, navigation, accessibility features, branding, dashboard setup, or database-connected workflows.

## Shared rules
- Keep the existing file and folder structure.
- Reuse `css/style.css` for shared styling.
- Reuse `js/app.js` only for shared frontend logic.
- Reuse `js/supabase.js` for shared database client access.
- Do not hardcode real credentials into tracked files.
- Keep page headings, navigation, brand block, and footer structure consistent across all pages where possible.
- Maintain keyboard accessibility and focus states.
- Preserve the high contrast mode button on every page.
- If you edit shared files, pull the latest version first to reduce merge conflicts.

## File ownership suggestion
### Member 1 - Project Coordinator / Home Page      - Vladyslav Vit
- `pages/index.html`
- shared layout review
- integration checks
- final cleanup

### Member 2 - Database Designer                    - Galo Sammartino
- `database/database_setup.sql`
- `database/ERD.html`
- Supabase table setup and data verification

### Member 3 - Books Page Developer                 - Khalid Mohamed
- `pages/books.html`
- `css/books.css`
- `js/Books.js`
- books-related UI and CRUD behaviour

### Member 4 - Members and Loans Developer          - Arsen Pariienko
- `pages/members.html`
- `pages/loans.html`
- `js/members.js`
- `js/loans.js`
- members and loans related UI sections

## Integration points
### Home page
The dashboard on `pages/index.html` already expects:
- `books`
- `members`
- `loans`
- `status` values of `active` and `overdue`

### Books page
Implemented integration areas:
- books list table
- add book modal
- edit book modal
- delete confirmation modal
- search by title or author

### Members page
Implemented integration areas:
- members list table
- add member form
- edit member form
- delete action controls
- member search and refresh workflow

### Loans page
Implemented integration areas:
- issue loan form
- return book action
- active loans table
- overdue loans table
- automatic overdue status sync on refresh

### Database area
The SQL script already includes:
- the three core tables
- sample records
- indexes for loans
- optional helper views for active loans, overdue loans, and dashboard summary

## Architecture note
- The homepage, members page, and loans page use the shared `js/config.js` + `js/supabase.js` integration pattern.
- The books page currently creates its own Supabase client inside `js/Books.js`.
- As a later cleanup step, the books page should be aligned with the shared configuration approach used by the rest of the project.

## Accessibility and UI expectations
When adding forms, tables, or new sections:
- use clear labels
- keep heading order correct
- ensure buttons are descriptive
- preserve visible focus outlines
- check mobile layout before committing
- keep the shared LibraryMS visual identity intact unless the team agrees on a redesign

## Commit guidance
- Use small logical commits
- Write meaningful commit messages
- Avoid mixing unrelated changes in one commit
- Pull latest changes before editing shared files
- Be extra careful when editing `css/style.css`, shared scripts, or shared header markup because they affect multiple pages

## Final reminder
The current project already includes shared navigation, responsive layout, accessible structure, contrast mode support, a working homepage dashboard, working books, members, and loans workflows, and a standalone ERD page. Build on top of this foundation instead of replacing it.
