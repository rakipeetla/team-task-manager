# Team Task Manager

A full-stack Team Task Management Web Application built with the MERN stack (MongoDB, Express, React, Node.js). 
It features a premium, glassmorphism UI, robust authentication, and comprehensive task management functionality including Kanban-style boards.

## Features
- **User Authentication**: Secure signup and login using JWT.
- **Project Management**: Create projects, manage members.
- **Task Management**: Create, assign, and track tasks (To Do, In Progress, Done) within projects.
- **Dashboard**: Visual statistics including total tasks, completed, in-progress, and overdue items.
- **Role-Based Access**: Admins can manage project members, while members can interact with their assigned projects and tasks.

## Technology Stack
- **Frontend**: React (Vite), React Router, Axios, Lucide Icons, Vanilla CSS (Glassmorphism design).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ORM).
- **Authentication**: JWT (JSON Web Tokens), bcrypt.

## Local Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Project
   ```

2. **Install dependencies:**
   This project is set up as a monorepo. Installing at the root will install for both backend and frontend.
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the `backend/` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/team-task-manager  # Or your MongoDB Atlas URI
   JWT_SECRET=your_super_secret_key
   ```

4. **Run the Application locally:**
   Start both the frontend and backend servers concurrently:
   ```bash
   npm run dev
   ```
   - The React app will run on `http://localhost:5173`
   - The Express API will run on `http://localhost:5000`

## Deployment to Railway (Live)
Can Access My Live Project From here -- > team-task-manager-production-bebd.up.railway.app




