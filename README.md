📋🦉RegiSmart

RegiSmart is a school learner registration and pickup management system. It helps schools register students, link them to parent accounts, generate QR codes, manage attendance states, and coordinate parent or transport-based pickup workflows.

The project is a lightweight static frontend with a small Node.js demo server and a Supabase backend.

## Features

- Parent, teacher, and admin login flows
- Role-based page guards and navigation
- Parent account signup
- Student registration with parent linking
- QR code generation and PNG download for each learner
- Teacher attendance tools for check-in and checkout
- Parent pickup verification using one-time codes
- Transport profile support for taxi, bus, or private pickup
- Admin dashboard with student search, filters, detail views, editing, deletion, and status statistics
- Family and medical information management

## Tech Stack

- HTML, CSS, and JavaScript modules
- Bootstrap 5
- Supabase Auth and Database
- `@supabase/supabase-js`
- QRCode.js
- Node.js static demo server
- Vercel-ready static deployment config

## Project Structure

```text
RegiSmart/
|-- index.html                 # Landing / entry page
|-- login.html                 # Login page
|-- signup.html                # Parent signup flow
|-- parent.html                # Parent portal
|-- teacher.html               # Teacher attendance portal
|-- admin.html                 # Admin dashboard
|-- app.js                     # Shared UI, auth, guards, and workflow helpers
|-- supabase.js                # Supabase client and data functions
|-- styles.css                 # Shared styling
|-- server.js                  # Local static demo server
|-- database schemas.js        # Reference SQL table definitions
|-- STUDENT_RLS_POLICIES.sql   # Baseline RLS policies for profiles/students
|-- DEPLOY.md                  # Deployment/demo notes
|-- vercel.json                # Vercel routing and headers
`-- package.json               # Node scripts and dependencies
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- A Supabase project with the required tables and RLS policies

### Installation

```bash
npm install
```

### Run Locally

```bash
npm run demo
```

The demo server starts on:

```text
http://localhost:4173
```

It also prints local network URLs so phones or laptops on the same Wi-Fi can open the app during demos.

## Supabase Setup

This app expects Supabase Auth and the following public tables:

- `profiles`
- `students`
- `attendance_logs`
- `family_details`
- `medical_info`
- `transport_profiles`

The reference schema is in `database schemas.js`. Baseline row-level security policies for `profiles` and `students` are in `STUDENT_RLS_POLICIES.sql`.

Important security notes:

- Use only a Supabase publishable key in frontend code.
- Never expose a Supabase service role key in this repository.
- Enable RLS for exposed tables and create policies that match the parent, teacher, and admin access model.
- Admin and teacher accounts need matching rows in `profiles` with the correct `role` value.

## User Roles

### Parent

Parents can sign up, log in, view linked learners, complete learner details, and confirm pickup-related information.

### Teacher

Teachers can scan or manage learner attendance, check students in, start pickup flows, and confirm pickup codes.

### Admin

Admins can register students, link students to parent accounts, generate QR codes, edit records, remove records, view family/medical/transport details, and monitor current attendance status.

## Attendance Statuses

RegiSmart uses these learner status values across the dashboard and pickup workflows:

- `At School`
- `Pending Pickup`
- `Pending Transport`
- `Checked Out`
- `Checked Out (Transport)`

## Deployment

The project can be deployed as a static site. Vercel is supported through `vercel.json`, which enables clean routes such as:

```text
/admin
/teacher
/parent
/login
/signup
```

For more deployment notes, see `DEPLOY.md`.

## Useful Scripts

```bash
npm run demo
npm start
npm run serve
```

All three commands run the same local static server.

## Notes for Contributors

- Keep Supabase keys limited to publishable frontend keys.
- Update the schema notes when adding or changing database tables.
- Keep role-based behavior consistent across `app.js`, page guards, and Supabase RLS policies.
- Test parent, teacher, and admin flows after changing shared auth or attendance logic.
