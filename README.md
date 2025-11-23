# Task Management API

A REST API for managing projects and tasks.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create the database:
    ```bash
    npm run setup
    ```

3. Seed with sample data:
    ```bash
    npm run seed
    ```

4. Start the server:
    ```bash
    npm start
    ```


## API Endpoints

### Projects

- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Project Structure

```plaintext
task-management-api/
├── database/
│   ├── setup.js    # Database setup and models
│   └── seed.js     # Sample data
├── server.js       # Main server file
├── package.json    # Dependencies
├── .env            # Environment variables
└── README.md       # This file
```
Task Management API – Authentication System

A secure REST API built with **Node.js, Express, and Sequelize (SQLite)** that supports user registration, login, session-based authentication, and protected project/task management. Users can only access and manage **their own** projects and tasks.

---
 Features

 Authentication
- Secure user registration with **bcrypt password hashing**
- Login system that creates a session using **express-session**
- Logout that destroys the session
- Authentication middleware to protect private routes

 Database & Relationships
Using Sequelize ORM:
- **User → Projects (1:M)**
- **Project → Tasks (1:M)**
- Foreign keys:
  - `project.userId`
  - `task.projectId`

 Protected Routes
Only logged-in users can access:
GET /api/projects


---
 Setup Instructions

1. Install Dependencies

2. Create a .env File
DB_NAME=task_management.db
DB_TYPE=sqlite
NODE_ENV=development
PORT=3000
3. Initialize the Database
npm run setup
npm run seed
4. Start the Server
node server.js
API Endpoints
Test Route
GET /test
Register User
POST /api/register
Body:
json
{
  "username": "tiff",
  "email": "tiff@example.com",
  "password": "pass123"
}
Login
POST /api/login
Body:
{
  "email": "tiff@example.com",
  "password": "pass123"
}
Protected: Get Projects
GET /api/projects
 Requires authentication

Logout
POST /api/logout
Assignment Requirements Covered
Secure password hashing (bcrypt)
User registration
User login
User logout
Users table connected to Projects → Tasks via foreign keys
Authentication middleware
Protected route (GET /api/projects)
Full auth flow: register → login → access → logout
README documentation