# Creator Center Project Structure

## Directory Structure

This document outlines the recommended directory structure for the Creator Center project, providing a clear organization for both frontend and backend components.

```
project/
├── backend/
│   ├── config/                 # Configuration files
│   │   ├── database.js         # Database configuration
│   │   └── env.js              # Environment variables
│   ├── controllers/            # Request handlers
│   │   ├── authController.js   # Authentication logic
│   │   ├── videoController.js  # Video management logic
│   │   ├── analyticsController.js # Analytics logic
│   │   ├── trendingController.js # Trending content logic
│   │   └── aiController.js     # AI integration logic
│   ├── middleware/             # Express middleware
│   │   ├── auth.js             # Authentication middleware
│   │   ├── errorHandler.js     # Error handling middleware
│   │   └── upload.js           # File upload middleware
│   ├── models/                 # Database models
│   │   ├── User.js             # User model
│   │   ├── Video.js            # Video model
│   │   ├── Analytics.js        # Analytics model
│   │   ├── TrendingContent.js  # Trending content model
│   │   └── AIChatLog.js        # AI chat log model
│   ├── routes/                 # API routes
│   │   ├── auth.js             # Authentication routes
│   │   ├── videos.js           # Video management routes
│   │   ├── analytics.js        # Analytics routes
│   │   ├── trending.js         # Trending content routes
│   │   └── ai.js               # AI integration routes
│   ├── services/               # Business logic
│   │   ├── authService.js      # Authentication service
│   │   ├── videoService.js     # Video service
│   │   ├── analyticsService.js # Analytics service
│   │   ├── trendingService.js  # Trending service
│   │   └── aiService.js        # AI service
│   ├── utils/                  # Utility functions
│   │   ├── logger.js           # Logging utility
│   │   ├── validators.js       # Input validation
│   │   └── helpers.js          # Helper functions
│   ├── app.js                  # Express application setup
│   ├── server.js               # Server entry point
│   └── package.json            # Backend dependencies
│
├── frontend/
│   ├── public/                 # Static files
│   │   ├── index.html          # HTML entry point
│   │   └── assets/             # Static assets
│   ├── src/                    # Source code
│   │   ├── components/         # Reusable components
│   │   │   ├── auth/           # Authentication components
│   │   │   ├── dashboard/      # Dashboard components
│   │   │   ├── videos/         # Video management components
│   │   │   ├── analytics/      # Analytics components
│   │   │   ├── trending/       # Trending content components
│   │   │   └── ai/             # AI assistant components
│   │   ├── contexts/           # React contexts
│   │   │   └── AuthContext.js  # Authentication context
│   │   ├── hooks/              # Custom React hooks
│   │   ├── pages/              # Page components
│   │   │   ├── Login.js        # Login page
│   │   │   ├── Dashboard.js    # Dashboard page
│   │   │   ├── VideoManager.js # Video management page
│   │   │   ├── Analytics.js    # Analytics page
│   │   │   ├── Inspiration.js  # Inspiration hub page
│   │   │   └── AIAssistant.js  # AI assistant page
│   │   ├── services/           # API service clients
│   │   │   ├── api.js          # API client setup
│   │   │   ├── auth.js         # Authentication API
│   │   │   ├── videos.js       # Video API
│   │   │   ├── analytics.js    # Analytics API
│   │   │   ├── trending.js     # Trending API
│   │   │   └── ai.js           # AI API
│   │   ├── utils/              # Utility functions
│   │   ├── App.js              # Main application component
│   │   ├── index.js            # React entry point
│   │   └── routes.js           # Application routes
│   ├── package.json            # Frontend dependencies
│   └── README.md               # Frontend documentation
│
├── log/                        # Project documentation
│   ├── README.md               # Project overview
│   ├── PROJECT_PLAN.md         # Detailed project plan
│   └── PROJECT_STRUCTURE.md    # Project structure documentation
│
├── .gitignore                  # Git ignore file
└── README.md                   # Root README file
```

## Key Components Description

### Backend Components

- **Config**: Contains configuration files for the database, environment variables, and other settings.
- **Controllers**: Handle HTTP requests and responses, implementing the API endpoints logic.
- **Middleware**: Contains Express middleware for authentication, error handling, and file uploads.
- **Models**: Define database schemas and models using an ORM like Sequelize.
- **Routes**: Define API routes and connect them to the appropriate controllers.
- **Services**: Implement business logic, separating it from the controllers.
- **Utils**: Contain utility functions used throughout the application.

### Frontend Components

- **Components**: Reusable UI components organized by feature.
- **Contexts**: React contexts for state management across components.
- **Hooks**: Custom React hooks for shared functionality.
- **Pages**: Top-level page components that compose the UI.
- **Services**: API client services for communicating with the backend.
- **Utils**: Utility functions for the frontend application.

## Database Schema

The database schema is defined in the PROJECT_PLAN.md document, including tables for users, videos, analytics, trending content, and AI chat logs.

## Development Workflow

1. Clone the repository
2. Install dependencies for both frontend and backend
3. Set up the database according to the schema
4. Start the backend server
5. Start the frontend development server
6. Follow the development phases outlined in the PROJECT_PLAN.md document

## Deployment

The deployment strategy is outlined in the PROJECT_PLAN.md document, including development, staging, and production environments.