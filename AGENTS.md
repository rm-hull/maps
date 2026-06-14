# AGENTS.md

## Project Overview

This is a web application that displays UK Ordnance Survey (OS) maps, supporting multiple map styles (e.g., Leisure, Roads), points of interest (e.g., from Geograph), and GPS track integration (GPX/KML). It is built with React, TypeScript, and Vite, using Leaflet.js and MapLibre GL for rendering maps and Chakra UI for the user interface.

### Project Structure

- `src/components`: Contains reusable React components, organized by feature (e.g., `map`, `settings`).
- `src/hooks`: Custom React hooks for managing state and side effects (e.g., `useCurrentLocation`, `useGpsRoutes`).
- `src/pages`: Top-level page components that correspond to routes.
- `src/services`: Modules for interacting with external APIs (e.g., OS DataHub, Geograph).
- `src/config`: Application configuration, such as map layer definitions.
- `src/icons`: SVG icons and Leaflet marker definitions.
- `src/utils`: Utility functions.

### Key Technologies:

- **Frontend Framework:** React
- **Language:** TypeScript
- **Build Tool:** Vite
- **Package Manager:** Yarn
- **Mapping Library:** Leaflet.js, React-Leaflet, maplibre-gl
- **UI Components:** Chakra UI
- **State Management:** Local storage (via `@rm-hull/use-local-storage`)
- **Data Fetching:** react-query
- **Routing:** react-router-dom
- **Testing:** Vitest, React Testing Library

## Building and Running

### Prerequisites:

Before running the application, you need to create a `.env` file in the root of the project. While some features work with minimal config, the following variables are used throughout the application:

```env
VITE_OS_DATAHUB_API_KEY=<your OS Datahub API key here>
VITE_GEOGRAPH_API_KEY=<your Geograph API key here>

# Optional/Service API URLs and Keys
VITE_MAPPROXY_BASE_URL=
VITE_FUEL_PRICES_API_URL=
VITE_GPS_ROUTES_API_URL=
VITE_GPS_ROUTES_API_KEY=
VITE_PLACENAMES_API_URL=
VITE_STREET_MANAGER_API_URL=
VITE_GEODS_POI_API_URL=
VITE_POSTCODE_POLYGONS_API_URL=
VITE_COMPANY_DATA_API_URL=
VITE_NEXT_DEPARTURES_API_URL=
VITE_THUNDERFOREST_API_KEY=
VITE_TOMTOM_API_KEY=
VITE_CORS_PROXY=

# Analytics and Monitoring
VITE_GOOGLE_ANALYTICS_MEASUREMENT_ID=
VITE_SENTRY_DSN=
```

You can obtain these API keys by creating accounts on the [OS DataHub](https://osdatahub.os.uk/) and [Geograph UK](https://www.geograph.org.uk/).

### Commands:

- **Install dependencies:**
  ```bash
  yarn install
  ```
- **Run the development server:**
  ```bash
  yarn dev
  ```
- **Build for production:**
  ```bash
  yarn build
  ```
- **Run tests in watch mode (do not use for AI assistance):**
  ```bash
  yarn test:watch
  ```
- **Run tests normally:**
  ```bash
  yarn test
  ```
- **Lint the code:**
  ```bash
  yarn lint
  ```
- **Preview the production build:**
  ```bash
  yarn preview
  ```

## Development Conventions

- The project uses [Vite](https://vitejs.dev/) for development and building.
- [ESLint](https://eslint.org/) is used for linting the code. The configuration can be found in `eslint.config.js`.
- [Prettier](https://prettier.io/) is used for code formatting. The configuration can be found in `.prettierrc`.
- The project uses [Chakra UI](https://chakra-ui.com/) for UI components.
- The project uses [Vitest](https://vitest.dev/) for testing.
- The project follows the conventional commits specification for commit messages.
