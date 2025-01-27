# Documentation

<!--toc:start-->

- [Documentation](#documentation)
  - [Overview](#overview)
  - [Project Structure](#project-structure)
  - [Configuration Files](#configuration-files)
    - [`package.json`](#packagejson)
    - [`tsconfig.json`](#tsconfigjson)
    - [`eslint.config.js`](#eslintconfigjs)
    - [`prettier.config.js`](#prettierconfigjs)
    - [`.env`](#env)
  - [Scripts](#scripts)
  - [Running the Code Locally in development mode](#running-the-code-locally-in-development-mode)
  - [Running the Code Locally in production mode](#running-the-code-locally-in-production-mode)
  - [Running the Code via Docker](#running-the-code-via-docker)
  - [Linting and Formatting](#linting-and-formatting)
  - [TypeScript Configuration](#typescript-configuration)
  - [Commitizen](#commitizen)
  <!--toc:end-->

## Overview

This project is a backend service built with TypeScript. It uses various tools and libraries for development, including ESLint for linting, Prettier for code formatting, and Vitest for testing.

## Project Structure

- `src/`: Contains the source code of the project.
  - `api`: Containing the app logic.
  - `api/index.ts`: Entry point.
  - `types/`: Contains the additional types.
  - `utils/`: Contains utility functions.
- `dist/`: The output directory for the compiled code.

## Configuration Files

### `package.json`

This file contains the project metadata, dependencies, and scripts.

### `tsconfig.json`

This file configures the TypeScript compiler options.

### `eslint.config.js`

This file configures ESLint for linting TypeScript code.

### `prettier.config.js`

This file configures Prettier for code formatting.

### `.env`

This file contains environment variables required for the project. Make sure to set up this file before running the project. Sample config is available in .env.example

## Scripts

The following scripts are defined in `package.json`:

- `dev`: Starts the development server with hot-reloading.

  ```sh
  npm run dev
  ```

- `start`: Starts the production server.

  ```sh
  npm start
  ```

- `build`: Compiles the TypeScript code to JavaScript.

  ```sh
  npm run build
  ```

- `clean`: Removes the `dist` and `coverage` directories.

  ```sh
  npm run clean
  ```

- `format:write`: Formats the code using Prettier and writes the changes.

  ```sh
  npm run format:write
  ```

- `format:check`: Checks the code formatting using Prettier.

  ```sh
  npm run format:check
  ```

- `test`: Runs the tests using vitest.
  ```sh
  npm run test
  ```

## Running the Code Locally in development mode

1. **Install Dependencies**:

   ```sh
   npm install
   ```

2. **Start Development Server**:
   ```sh
   npm run dev
   ```

## Running the Code Locally in production mode

1. **Build the Project**:

   ```sh
   npm run build
   ```

2. **Start Production Server**:
   ```sh
   npm start
   ```

## Running the Code via Docker

1. **Build the Imager**:

   ```sh
   docker build -t ryde-be-api .
   ```

2. **Start the Image**:

   ```sh
   docker run --env-file .env -p 3001:3001 ryde-be-api

   ```

## Linting and Formatting

- **ESLint**: Configured in `eslint.config.js` to lint TypeScript files.
- **Prettier**: Configured in `prettier.config.js` to format code.

## TypeScript Configuration

- The TypeScript configuration is defined in `tsconfig.json`.
- The `include` and `exclude` options specify which files to include and exclude from the compilation.
- Alias paths are defined in the `paths` option to simplify imports.

## Commitizen

- The project uses Commitizen for standardized commit messages.
- To make a commit, use:
  ```sh
  npx cz
  or cz if you have it installed globally
  ```
