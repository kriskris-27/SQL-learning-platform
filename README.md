# CipherSQLStudio 🚀

CipherSQLStudio is a modern, full-stack SQL learning platform designed to help students practice SQL queries in an isolated, interactive environment with real-time feedback and AI-powered tutoring.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React.js](https://reactjs.org/) (with [Vite](https://vitejs.dev/) for ultra-fast builds)
- **Language**: [TypeScript](https://www.typescriptlang.org/) for type safety.
- **Styling**: [Vanilla SCSS](https://sass-lang.com/) with a **Mobile-First** approach and **BEM** naming conventions.
- **Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/) (the engine behind VS Code).
- **Icons**: [Lucide React](https://lucide.dev/).

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/).
- **Database (Persistence)**: [MongoDB Atlas](https://www.mongodb.com/atlas) for user data and assignment metadata.
- **Database (Sandbox)**: [PostgreSQL](https://www.postgresql.org/) (via [Neon](https://neon.tech/)) for safe query execution.
- **Authentication**: [JWT](https://jwt.io/) & [bcryptjs](https://github.com/dcodeIO/bcrypt.js) for secure sessions.
- **AI Integration**: [Gemini API](https://ai.google.dev/) for intelligent, context-aware SQL hints.

## ✨ Key Features

- **Adaptive SQL Sandbox**: Write and run complex SQL queries with syntax highlighting and instant results.
- **Dynamic Schema Explorer**: Visualize the underlying database tables and columns for each challenge.
- **AI SQL Tutor**: Stuck on a query? Get personalized hints that guide you to the solution without giving it away.
- **Secure Authentication**: Dedicated user profiles with secure registration and login flows.
- **Mobile-First Design**: Practice SQL anywhere with a fully responsive UI optimized for phones, tablets, and desktops.
- **Isolated Execution**: User-specific PostgreSQL schemas ensure your playground remains clean and secure.

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <repository-url>
cd og-schools
```

### 2. Configure Backend
Navigate to the `server` directory and install dependencies:
```bash
cd server
npm install
```
Create a `.env` file based on `.env.example` and fill in your credentials for MongoDB, PostgreSQL, and the Gemini API.

Run the server in development mode:
```bash
npm run dev
```

### 3. Configure Frontend
Navigate to the `client` directory and install dependencies:
```bash
cd ../client
npm install
```
Start the development server:
```bash
npm run dev
```

### 4. Open in Browser
Visit [http://localhost:5173](http://localhost:5173) to start your SQL journey!

## 📜 License
This project is for educational purposes. All rights reserved.
