# Creator Center Platform

## Project Overview

The Creator Center is a web-based platform designed for content creators on a short video platform. It enables creators to manage video uploads, analyze audience engagement, and explore trending topics. The project follows a frontend-backend separation architecture with React for the frontend, Node.js/Express for the backend, and MySQL for data storage.

## Key Features

### Frontend Capabilities
- **Content Management**: Video uploading, editing, and publishing workflows
- **Analytics Dashboard**: Audience insights and engagement metrics visualization
- **Inspiration Hub**: Trending content and creator recommendations
- **AI Chatbot Assistant**: Interactive AI-powered conversation for performance insights and creative inspiration

### Backend Capabilities
- **RESTful API**: Secure endpoints for all platform features
- **File Handling**: Video upload and metadata management
- **Mock Data Simulation**: Engagement analytics and trending content
- **AI Integration**: External AI API connection for chatbot and content suggestions

### Database Design
- Relational database (MySQL) with tables for users, videos, analytics, trending content, and AI chat logs

### Use Docker

To run this application using Docker:

1. Make sure Docker and Docker Compose are installed on your system
2. Clone this repository
3. Navigate to the project root directory
4. Run the following command to start all services:

```bash
docker-compose up -d
```

This will start the client on port 3000, server on port 5000, and MySQL database on port 3306.

To stop all services:

```bash
docker-compose down
```

## Development Setup

If you prefer to run the application without Docker:

### Server Setup
1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
PORT=5000
DB_HOST=localhost
DB_USER=creator
DB_PASSWORD=password
DB_NAME=creator_center
JWT_SECRET=your_jwt_secret
```

4. Start the server:
```bash
npm run dev
```

### Client Setup
1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the client:
```bash
npm start
```

## Project Structure

```
creator_center/
├── client/                   # React client application
│   ├── public/               # Static assets
│   └── src/                  # Source code
├── server/                   # Node.js/Express server
│   ├── src/                  # Source code
│   └── uploads/              # User uploaded files
├── docker/                   # Docker configuration
├── docker-compose.yml        # Docker Compose configuration
└── README.md                 # Project documentation
```
