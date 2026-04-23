# Library Management System

A database-driven web application for managing books, library members, and book loans through a simple and user-friendly interface.

## Project Overview
This project is being developed as a group coursework submission. The system is designed to demonstrate relational database design, CRUD functionality, frontend integration, version control, and teamwork.

The application will allow users to:
- view and manage books
- view and manage library members
- issue books to members
- record returns
- track overdue books
- view summary information on the dashboard

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

## Planned Pages
- **Home / Dashboard** - summary cards and project introduction
- **Books** - view, add, edit, and delete books
- **Members** - view, add, edit, and delete members
- **Loans** - issue books, record returns, and view overdue loans
- **About** - project information, team roles, and design decisions

## Folder Structure
- `pages/` - main HTML pages
- `css/` - shared stylesheets
- `js/` - JavaScript files and Supabase configuration
- `assets/` - images, icons, and static assets
- `database/` - SQL setup scripts, ERD files, and sample data
- `docs/` - planning notes and supporting project documentation

## Database Tables
The system is based on three main relational tables:
- **Books**
- **Members**
- **Loans**

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

## Running the Project
At the current stage, the project can be opened directly in a browser by loading the HTML files from the `pages/` folder.

Later stages will connect the frontend to Supabase using JavaScript.

## Supabase Configuration
Supabase integration is prepared through a scaffolded frontend setup.

### Setup files
- `js/config.example.js` - sample configuration template
- `js/config.js` - local configuration file for real project values
- `js/supabase.js` - reusable Supabase client scaffold
- `docs/supabase-setup.md` - setup instructions for the team

### Current dashboard data mapping
The homepage dashboard is prepared to load summary values from the SQL schema used in this project:
- `books` table -> total books count
- `members` table -> total members count
- `loans` table with `status = 'active'` -> active loans count
- `loans` table with `status = 'overdue'` -> overdue books count

### Important notes
- never commit real project credentials to the repository
- only use the public anon key in frontend code
- keep service role keys out of the browser

## Current Status
This repository currently contains:
- the initial project folder structure
- shared navigation and layout across pages
- an accessible and responsive homepage dashboard
- high contrast mode support
- Supabase connection scaffolding
- dashboard data-loading preparation based on the project SQL schema
- team handoff notes for coordinated development
- a working Members page with CRUD operations
- a working Loans page with issue, return, and overdue tracking flows
