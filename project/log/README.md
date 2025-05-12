## Project Overview
This is a web-based Creator Center designed for a short video platform. The platform allows content creators to manage their video uploads, analyze audience engagement, and explore trending topics. The project follows a frontend-backend separation architecture. The frontend is built with React, providing a responsive and interactive user interface. The backend is powered by Node.js with Express, offering a scalable and efficient RESTful API service. Data is stored and managed using a MySQL relational database, ensuring reliable and structured data handling.

## Project Features
- Frontend Capabilities
    - User Authentication: Creators can securely log in to access their personalized dashboard.
    - Content Management: Support for video uploading, processing, and publishing workflows.
    - Post-Publication Analytics (mock data): View audience insights, engagement metrics, and generate weekly performance reports.
    - Inspiration Hub (mock data):
        - Display trending video charts
        - Recommend high-performing creator content
        - Offer intelligent content improvement suggestions
    - AI Chatbot Assistant:
        - Helps creators understand their video performance
        - Provides creative inspiration through interactive AI-powered conversation

- Backend Capabilities
    - RESTful API Development
    Built with Node.js and Express, exposing secure endpoints for user authentication, video upload/processing, analytics retrieval, and AI assistant integration.

    - File Handling & Media Processing
    Handles video uploads, basic validation, and metadata storage before publication.

    - Mock Data Simulation
    Generates simulated engagement analytics and trending content data to power dashboards and inspiration modules.

    - AI Assistant Integration

        - Connects with external AI APIs (e.g., OpenAI GPT-4) via HTTP requests.

        - Provides two core features:

            - Creator chatbot for personalized Q&A

            - Smart content suggestions based on uploaded video metadata

        - Prompts are dynamically constructed using creator info, video titles, and mock analytics.

    - Security & Config Management
    Sensitive tokens (like API keys) are managed via environment variables. Rate limiting and usage logging can be optionally added.

- Database Design (MySQL)
    - users
    Stores creator account data: ID, username, hashed password, profile info, access timestamps.

    - videos
    Contains metadata on uploaded content: ID, creator ID, file path, title, tags, status, publish time.

    - analytics (mock data)
    Tracks simulated post-publish metrics: video ID, views, likes, comments, audience demographics, weekly trend scores.

    - trending_content (mock data)
    Maintains lists of top videos, featured creators, hot tags.

    - ai_chat_logs (optional)
    Stores AI assistant chat records: user ID, timestamp, user query, AI response, session ID (for context continuity).