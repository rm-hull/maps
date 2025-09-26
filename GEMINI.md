# GEMINI.md

## Project Overview

This is a web application that displays UK Ordnance Survey maps. It is built with React, TypeScript, and Vite. It uses Leaflet.js for rendering maps and Chakra UI for the user interface. The application allows users to view maps, search for locations, and display points of interest.

### Key Technologies:

*   **Frontend Framework:** React
*   **Language:** TypeScript
*   **Build Tool:** Vite
*   **Package Manager:** Yarn
*   **Mapping Library:** Leaflet.js
*   **UI Components:** Chakra UI
*   **Data Fetching:** react-query
*   **Routing:** react-router-dom

## Building and Running

### Prerequisites:

Before running the application, you need to create a `.env` file in the root of the project with the following content:

```
REACT_APP_OS_DATAHUB_API_KEY=<your OS Datahub API key here>
REACT_APP_GEOGRAPH_API_KEY=<your Geograph API key here>
```

You can obtain these API keys by creating accounts on the [OS DataHub](https://osdatahub.os.uk/) and [Geograph UK](https://www.geograph.org.uk/).

### Commands:

*   **Install dependencies:**
    ```bash
    yarn install
    ```
*   **Run the development server:**
    ```bash
    yarn dev
    ```
*   **Build for production:**
    ```bash
    yarn build
    ```
*   **Run tests:**
    ```bash
    yarn test
    ```
*   **Lint the code:**
    ```bash
    yarn lint
    ```
*   **Preview the production build:**
    ```bash
    yarn preview
    ```

## Development Conventions

*   The project uses [Vite](https://vitejs.dev/) for development and building.
*   [ESLint](https://eslint.org/) is used for linting the code. The configuration can be found in `eslint.config.js`.
*   [Prettier](https://prettier.io/) is used for code formatting. The configuration can be found in `.prettierrc`.
*   The project uses [Chakra UI](https://chakra-ui.com/) for UI components.
*   The project uses [Vitest](https://vitest.dev/) for testing.
*   The project follows the conventional commits specification for commit messages.
