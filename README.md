# HireHub Onboarding Portal

A modern employee onboarding portal built with React 18+, Vite, and React Router v6. This application streamlines the new hire onboarding process with an intuitive, step-by-step interface.

## Tech Stack

- **React 18+** — UI library with functional components and hooks
- **Vite** — Fast build tool and development server
- **React Router v6** — Client-side routing with `createBrowserRouter`
- **Plain CSS** — Styling without external CSS frameworks
- **Vitest** — Unit and component testing
- **React Testing Library** — Component testing utilities

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+

### Installation

```bash
npm install
```

### Development

Start the local development server:

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

### Build

Create a production build:

```bash
npm run build
```

The output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Folder Structure

```
hirehub-onboarding-portal/
├── public/                  # Static assets
├── src/
│   ├── assets/              # Images, icons, and other assets
│   ├── components/          # Reusable UI components
│   ├── context/             # React context providers
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page/route components (default exports)
│   ├── services/            # API service modules
│   ├── utils/               # Utility functions and helpers
│   ├── App.jsx              # Root component with router configuration
│   ├── index.css            # Global styles
│   └── main.jsx             # Application entry point
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── package.json             # Dependencies and scripts
└── README.md                # Project documentation
```

## Features

- **Dashboard** — Overview of onboarding progress and pending tasks
- **Personal Information** — Collect and manage new hire personal details
- **Document Upload** — Upload and manage required onboarding documents
- **Task Checklist** — Track completion of onboarding tasks and milestones
- **Team Introduction** — View team members and organizational structure
- **Progress Tracking** — Visual progress indicators for onboarding completion
- **Form Validation** — Client-side validation for all input forms
- **Responsive Design** — Mobile-friendly layout using plain CSS
- **Error Handling** — Graceful error states with loading indicators for async operations

## Environment Variables

Environment variables are accessed via `import.meta.env` and must be prefixed with `VITE_`:

```
VITE_API_BASE_URL=https://api.example.com
```

Create a `.env` file in the project root for local development. Never commit `.env` files to version control.

## Deployment (Vercel)

### Automatic Deployment

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Import the project in [Vercel](https://vercel.com).
3. Vercel will auto-detect the Vite framework and configure the build settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Set any required environment variables in the Vercel project settings.
5. Deploy.

### Manual Deployment

```bash
npm install -g vercel
vercel
```

### SPA Routing

For client-side routing with React Router, add a `vercel.json` file to the project root:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This ensures all routes are handled by the React application.

## Scripts Reference

| Script            | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start development server             |
| `npm run build`   | Create production build              |
| `npm run preview` | Preview production build locally     |
| `npm test`        | Run test suite                       |
| `npm run test:watch` | Run tests in watch mode           |

## License

**Private** — All rights reserved. This project is proprietary and confidential.