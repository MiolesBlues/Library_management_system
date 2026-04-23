# Team Integration Guide

## Purpose
This guide explains how each team member should continue development inside the shared project structure without breaking the existing layout, navigation, accessibility features, or dashboard setup.

## Shared rules
- Keep the existing file and folder structure.
- Reuse `css/style.css` for shared styling.
- Reuse `js/app.js` only for shared frontend logic.
- Reuse `js/supabase.js` for database client access.
- Do not hardcode real credentials into tracked files.
- Keep page headings, navigation, and footer structure consistent across all pages.
- Maintain keyboard accessibility and focus states.
- Preserve the high contrast mode button on every page.

## File ownership suggestion
### Member 1 - Project Coordinator / Home Page
- `pages/index.html`
- shared layout review
- integration checks
- final cleanup

### Member 2 - Database Designer
- `database/library_setup.sql`
- `database/ERD.html`
- Supabase table setup and data verification

### Member 3 - Books Page Developer
- `pages/books.html`
- books-related sections in `js/app.js` if shared
- future book-specific scripts if needed

### Member 4 - Members and Loans Developer
- `pages/members.html`
- `pages/loans.html`
- members and loans related UI sections
- future page-specific scripts if needed

## Integration points
### Home page
The dashboard on `pages/index.html` already expects:
- `books`
- `members`
- `loans`
- `status` values of `active` and `overdue`

### Books page
Planned integration areas:
- book list table
- add book form
- edit book form
- delete action controls

### Members page
Planned integration areas:
- members list table
- add member form
- edit member form
- delete action controls

### Loans page
Planned integration areas:
- issue loan form
- return book action
- active loans table
- overdue loans table

## Accessibility expectations
When adding forms or tables:
- use clear labels
- keep heading order correct
- ensure buttons are descriptive
- preserve visible focus outlines
- check mobile layout before committing

## Commit guidance
- Use small logical commits
- Write meaningful commit messages
- Avoid mixing unrelated changes in one commit
- Pull latest changes before editing shared files

## Final reminder
The current project already includes shared navigation, responsive layout, accessible structure, contrast mode support, and dashboard preparation. Build on top of it instead of replacing the shared foundation.
