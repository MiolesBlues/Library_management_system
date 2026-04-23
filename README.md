# Library Management System

A database-driven web application for managing books, library members, and book loans through a simple and user-friendly interface.

## Project Overview
This project is being developed as a group coursework submission. The system is designed to demonstrate relational database design, CRUD functionality, frontend integration, version control, and teamwork.

The application is structured to support:
- viewing and managing books
- viewing and managing library members
- issuing books to members
- recording returns
- tracking overdue books
- showing summary information on the dashboard

## Project Aim
The aim of this project is to design and develop a simple web application that integrates a frontend interface with a relational database using Supabase.

## Objectives
1. Design a relational database for storing library information.
2. Create multiple connected web pages for interacting with the database.
3. Implement CRUD functionality for the main entities in the system.
4. Use Supabase as the database platform.
5. Use GitHub for version control and team collaboration.
6. Produce an ERD showing entities, attributes, and relationships.
7. Prepare a working group project for presentation and submission.

## Technology Stack
- HTML
- CSS
- JavaScript
- Supabase (PostgreSQL)
- GitHub

## Current Pages
- **Home / Dashboard** - responsive homepage with summary cards, quick actions, and user guidance
- **Books** - shared layout and placeholder area for future CRUD features
- **Members** - working members management workspace with CRUD operations and search
- **Loans** - working loans workspace with issue, return, and overdue tracking flows
- **About** - project information placeholder page
- **ERD** - standalone database diagram page in `database/ERD.html`

## Folder Structure
- `pages/` - main HTML pages
- `css/` - shared stylesheet used across the site, including the ERD page and management workspace styles
- `js/` - JavaScript files and Supabase configuration helpers
- `database/` - SQL setup script and ERD page
- `docs/` - planning notes and supporting project documentation
- `Database_plus_policies.sql` - extended SQL script including Row Level Security policies

## Database Tables
The system is based on three main relational tables:
- **books**
- **members**
- **loans**

### Books Table
- `book_id` (Primary Key)
- `title`
- `author`
- `genre`
- `published_year`
- `isbn`
- `total_copies`
- `available_copies`

### Members Table
- `member_id` (Primary Key)
- `full_name`
- `email`
- `phone`
- `membership_date`

### Loans Table
- `loan_id` (Primary Key)
- `book_id` (Foreign Key)
- `member_id` (Foreign Key)
- `loan_date`
- `due_date`
- `return_date`
- `status`

## Database Assets
The repository currently includes:
- `database/database_setup.sql` - main SQL script for creating tables, indexes, sample data, and optional views
- `Database_plus_policies.sql` - extended setup script with Row Level Security enabled and public policies for frontend access
- `database/ERD.html` - browser-viewable ERD page rendered with Mermaid

The SQL scripts define helper views such as:
- `v_active_loans`
- `v_overdue_loans`
- `v_dashboard_summary`

## Shared Frontend Features
The current frontend already includes:
- shared navigation and footer across pages
- responsive layout using a single shared stylesheet
- high contrast mode toggle
- dashboard status messaging
- homepage summary cards prepared for Supabase data
- shared header branding with a LibraryMS logo block
- ERD page styling moved into the shared stylesheet for consistency
- reusable management workspace styles for forms, toolbars, tables, and status badges

## Current Functional Areas
### Members page
The Members workspace currently supports:
- loading members from Supabase
- adding new member records
- editing existing member records
- deleting member records
- searching by name, email, phone, or membership date
- refreshing member data and showing last updated status

### Loans page
The Loans workspace currently supports:
- loading books, members, and loans from Supabase
- issuing new loan records
- recording returns
- automatic overdue status syncing on refresh
- separate overdue loans table
- active, overdue, and returned counters

## Team Roles
### Member 1 - Project Coordinator / Home Page Developer
- create and manage the GitHub repository
- organise the folder structure
- develop the Home / Dashboard page
- handle project integration and final review
- support team coordination

### Member 2 - Database Designer / ERD and SQL
- design the database schema
- create the ERD
- write the SQL setup script
- create the database tables in Supabase
- add test and sample data

### Member 3 - Books Page Developer
- develop the Books page
- implement CRUD operations for books
- create forms and tables for books
- test the page functionality

### Member 4 - Members and Loans Developer
- develop the Members page
- develop the Loans page
- implement member CRUD operations
- implement loan issue and return functionality
- display overdue records

## Collaboration Guidelines
To support teamwork and clear version tracking, all team members should:
- commit work regularly
- use short and meaningful commit messages
- upload progress weekly
- work on their assigned sections
- avoid overwriting another member's files without discussion
- pull the latest changes before editing shared files such as `css/style.css`, shared scripts, and page headers

## Running the Project
At the current stage, the main website can be opened directly in a browser by loading the HTML files from the `pages/` folder.

The ERD page can be opened separately from:
- `database/ERD.html`

## Supabase Configuration
Supabase integration is prepared through a scaffolded frontend setup.

### Setup files
- `js/config.example.js` - sample configuration template
- `js/config.js` - local configuration file for real project values
- `js/supabase.js` - reusable Supabase client scaffold
- `js/members.js` - Members page CRUD logic
- `js/loans.js` - Loans page issue, return, and overdue tracking logic
- `docs/supabase-setup.md` - setup instructions for the team

### Current dashboard data mapping
The homepage dashboard currently loads summary values using direct table counts:
- `books` table -> total books count
- `members` table -> total members count
- `loans` table with `status = 'active'` -> active loans count
- `loans` table with `status = 'overdue'` -> overdue books count

### Important notes
- never commit real project credentials to the repository
- only use the public anon key in frontend code
- keep service role keys out of the browser
- `js/config.js` should stay local if it contains real values
- if Supabase RLS is enabled, use the policies from `Database_plus_policies.sql` or equivalent table policies

## Current Status
This repository currently contains:
- a shared multi-page frontend structure
- a responsive and accessible homepage dashboard layout
- a working Members page with CRUD operations and search
- a working Loans page with issue, return, and overdue tracking flows
- placeholder pages for Books and About
- high contrast mode support
- Supabase connection scaffolding
- dashboard data-loading logic in `js/app.js`
- page-specific logic in `js/members.js` and `js/loans.js`
- a completed SQL setup script with sample data and optional views
- an extended SQL script with public RLS policies
- a standalone ERD page using Mermaid
- unified shared branding in the page header
- synced shared styling between the main site and the ERD page
