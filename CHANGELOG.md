# Changelog

All notable changes to the HireHub Onboarding Portal project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Added

- **Landing Page**
  - Hero section with welcome messaging and call-to-action for new hire onboarding
  - Feature cards highlighting key onboarding portal capabilities
  - Responsive layout adapting to mobile, tablet, and desktop viewports

- **Interest Form**
  - Multi-field form for new hires to express onboarding interest
  - Client-side validation for required fields, email format, and input constraints
  - Duplicate submission prevention based on email address matching
  - Success and error feedback messaging for form submissions
  - Form data persisted to localStorage for durability across sessions

- **Admin Login**
  - Dedicated login page with hardcoded credentials for admin access
  - Session management using sessionStorage to maintain authenticated state
  - Protected route redirection for unauthenticated users attempting to access admin pages

- **Admin Dashboard**
  - View all submitted interest form entries in a structured table layout
  - Create new entries manually from the admin interface
  - Edit existing entries with pre-populated form fields
  - Delete entries with confirmation to prevent accidental removal
  - Full CRUD operations backed by localStorage persistence

- **Client-Side Routing**
  - React Router-based navigation between landing page, interest form, admin login, and admin dashboard
  - Route protection for admin-only pages with automatic redirect to login
  - Browser history support for back/forward navigation

- **Responsive Design**
  - Mobile-first CSS approach ensuring usability across all device sizes
  - Flexible grid and flexbox layouts for content sections
  - Accessible form controls and interactive elements

- **Data Persistence**
  - localStorage used for interest form submissions providing persistence across browser sessions
  - sessionStorage used for admin authentication state scoped to the active browser tab