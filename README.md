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

## Deployment to Railway (Mandatory)

This repository is pre-configured to be deployed as a single service on Railway.

1. **Push your code to GitHub.**
2. Go to [Railway.app](https://railway.app/) and create a new project.
3. Select **Deploy from GitHub repo** and choose your repository.
4. Click on the Web Service box on your Railway canvas to open the Service Panel.
5. In your Service Panel, go to the **Variables** tab and set the following **Service Variables**:
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: (Generate a secure random string)
   - `MONGO_URI`: (Your MongoDB connection string, e.g., `mongodb+srv://...` or direct `mongodb://...`)
6. Railway will automatically detect the root `package.json`, install dependencies, run the `build` script (which builds the React frontend), and execute the `start` script (which starts the Express server that serves both the API and the static React files).

## Demo Video Instructions
For your submission, record a 2-5 minute video demonstrating:
1. The signup and login flow.
2. Creating a project and adding a member.
3. Creating a task and updating its status on the Kanban board.
4. Exploring the dashboard statistics.
5. Briefly explaining the folder structure and code architecture.
