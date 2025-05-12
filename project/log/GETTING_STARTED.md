# Creator Center - Getting Started Guide

## Introduction

This guide provides instructions for setting up and starting development on the Creator Center project. Follow these steps to get your development environment ready and begin contributing to the project.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v14.x or later)
- **npm** (v6.x or later)
- **MySQL** (v8.x or later)
- **Git** (latest stable version)

## Project Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd project
```

### 2. Environment Setup

#### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with the following variables:

```
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=creator_center

# JWT Secret
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d

# AI API Configuration (if applicable)
AI_API_KEY=your_api_key
AI_API_URL=https://api.example.com/v1
```

#### Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory with the following variables:

```
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_NODE_ENV=development
```

### 3. Database Setup

Create a MySQL database for the project:

```sql
CREATE DATABASE creator_center;
```

Run the database migrations (once the backend is set up with Sequelize or another ORM):

```bash
cd ../backend
npm run migrate
```

Optionally, seed the database with initial data:

```bash
npm run seed
```

## Running the Application

### Start the Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on http://localhost:3001 by default.

### Start the Frontend Development Server

```bash
cd ../frontend
npm start
```

The frontend development server will start on http://localhost:3000 by default.

## Project Structure

Refer to the `PROJECT_STRUCTURE.md` document for a detailed overview of the project's directory structure and organization.

## Development Workflow

### Branching Strategy

We follow a feature branch workflow:

1. Create a new branch for each feature or bugfix:
   ```bash
   git checkout -b feature/feature-name
   ```
   or
   ```bash
   git checkout -b bugfix/bug-name
   ```

2. Make your changes and commit them with descriptive messages

3. Push your branch to the remote repository

4. Create a pull request for review

### Code Style and Linting

The project uses ESLint and Prettier for code formatting and linting. Run the linting process with:

```bash
npm run lint
```

Fix automatically fixable issues with:

```bash
npm run lint:fix
```

### Testing

Run tests for the backend:

```bash
cd backend
npm test
```

Run tests for the frontend:

```bash
cd frontend
npm test
```

## Documentation

The project includes several documentation files:

- `README.md` - Project overview
- `PROJECT_PLAN.md` - Detailed project plan and timeline
- `PROJECT_STRUCTURE.md` - Directory structure and organization
- `TECHNICAL_REQUIREMENTS.md` - Technical specifications and requirements
- `GETTING_STARTED.md` - This guide for setting up the development environment

## Troubleshooting

### Common Issues

#### Database Connection Issues

If you encounter database connection issues:

1. Verify your MySQL service is running
2. Check your database credentials in the `.env` file
3. Ensure the database exists and is accessible

#### Node.js Version Issues

If you encounter compatibility issues with Node.js:

1. Verify you're using Node.js v14.x or later
2. Consider using a version manager like nvm to switch between Node.js versions

## Getting Help

If you need assistance with the project setup or have questions about the development process, please reach out to the project maintainers or refer to the project documentation.

## Next Steps

After setting up your development environment, refer to the `PROJECT_PLAN.md` document to understand the project phases and the current development focus.