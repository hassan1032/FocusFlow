
# FocusFlow — All-in-One Student Productivity Platform

FocusFlow is a full-stack productivity web app built for students and learners. It combines habit tracking, flashcard study, task management, Pomodoro timer, goal tracking, smart notes, AI-powered text summarization, and real-time analytics — all in one seamless dashboard.

---

## Live Demo

- **Frontend:** [https://focusflowfrontend.onrender.com](https://focusflowfrontend.onrender.com)

---

## Features

| Feature | Description |
|---|---|
| **Dashboard** | Analytics overview — tasks, habits, goals, Pomodoro sessions |
| **Kanban Board** | Drag-and-drop task management with To Do / In Progress / Done |
| **Calendar** | Monthly, weekly, and daily task calendar view |
| **Goals** | Set long-term goals with milestones and progress tracking |
| **Habit Tracker** | Daily habit logging with 7-day streak grid view |
| **Smart Notes** | Create, search, and organize rich-text notes |
| **Pomodoro Timer** | 25/5 focus sessions with session history |
| **Flashcards** | Create decks, flip cards, study mode with Know It / Still Learning |
| **AI Text Summarizer** | Paste any text and get an instant AI-powered summary |
| **Authentication** | Signup, Login, OTP email verification, Forgot Password |
| **Chatbot** | Floating AI assistant for app navigation and support |

---

## Tech Stack

### Frontend
- **React 19** + **Vite**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Framer Motion** — animations and transitions
- **React Router v6** — client-side routing
- **Axios** — HTTP requests
- **React Toastify** — toast notifications

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** — authentication (httpOnly cookies + Authorization header)
- **Bcrypt** — password hashing
- **Nodemailer** — OTP email (Gmail SMTP)
- **Zod** — request body validation
- **Hugging Face Inference API** (`facebook/bart-large-cnn`) — AI text summarization

---

## Project Structure

```
horizon/
├── backend/
│   ├── Controllers/        # Route handlers
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routers
│   ├── schemas/            # Zod validation schemas
│   ├── middleware.js        # JWT verification middleware
│   ├── mailer.js           # Nodemailer transporter setup
│   ├── reminder.js         # Study reminder email script
│   └── index.js            # Express app entry point
│
└── frontend/
    ├── src/
    │   ├── components/     # Shared + public page components
    │   ├── layouts/        # AppLayout, Sidebar, TopBar
    │   ├── pages/          # Dashboard, Kanban, Goals, etc.
    │   ├── textSummarize/  # AI Summary page
    │   ├── pomodora/       # Pomodoro timer
    │   ├── FlashApp.jsx    # Flashcard routing
    │   └── App.jsx         # Root routing
    └── index.html
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Gmail account with App Password enabled (for OTP emails)
- Hugging Face API key (for AI summarization)

### 1. Clone the repository

```bash
git clone https://github.com/hassan1032/FocusFlow.git
cd FocusFlow
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/focusflow
TOKEN_KEY=your_jwt_secret_key_here
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
HF_API_KEY=your_huggingface_api_key
```

> **Gmail App Password:** Enable 2-Step Verification on your Google account, then generate an App Password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).

Start the backend:

```bash
node index.js
```

Backend runs on `http://localhost:3000`.

### 3. Frontend setup

```bash
cd ../frontend
npm install
```

Update `frontend/src/environment.js` for local development:

```js
const baseURL = "http://localhost:3000";
export default baseURL;
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`.

---

## Environment Variables Reference

| Variable | Location | Description |
|---|---|---|
| `MONGO_URI` | backend/.env | MongoDB connection string |
| `TOKEN_KEY` | backend/.env | JWT signing secret |
| `EMAIL_USER` | backend/.env | Gmail address for OTP emails |
| `EMAIL_PASS` | backend/.env | Gmail App Password |
| `HF_API_KEY` | backend/.env | Hugging Face API key |

---

## API Endpoints

### Auth
| Method | Route | Description |
|---|---|---|
| POST | `/signup` | Create new account |
| POST | `/login` | Login and receive JWT |
| POST | `/logout` | Clear session cookie |
| POST | `/verifyOTP` | Verify OTP code |
| POST | `/forgetPassword` | Reset password via OTP |
| PATCH | `/api/user/profile` | Update username |
| DELETE | `/api/user/account` | Delete account + all data |

### Tasks / Goals / Habits / Notes
| Method | Route | Description |
|---|---|---|
| GET / POST | `/api/tasks` | List all / Create task |
| PUT / DELETE | `/api/tasks/:id` | Update / Delete task |
| GET / POST | `/api/goals` | List all / Create goal |
| GET / POST | `/api/habits/all`, `/create` | Habits CRUD |
| GET / POST | `/api/notes` | Notes CRUD |

### Flashcards
| Method | Route | Description |
|---|---|---|
| GET / POST | `/api/flash/createDeck/all`, `/create` | List / Create deck |
| PUT / DELETE | `/api/flash/createDeck/:id` | Update / Delete deck |
| GET / POST | `/api/flash/createcard/all`, `/create` | List / Create card |
| PUT / DELETE | `/api/flash/createcard/:id` | Update / Delete card |
| GET | `/api/flash/createdeck/one/:id` | Get deck with all cards |

### AI Summary
| Method | Route | Description |
|---|---|---|
| POST | `/textSummary` | Summarize text with Hugging Face AI |

---

## Deployment

The app is deployed on **Render**:

- **Frontend:** Static site — build command `npm run build`, publish dir `dist`
- **Backend:** Web service — start command `node index.js`

Set all environment variables in Render's dashboard under **Environment**.

---

## Contributing

This project is maintained by **hassan1032**.

---

## License

MIT License — free to use and modify.

## Overview
Focus Flow is a productivity-enhancing web application designed for students to efficiently manage their study sessions using various features like note-taking, habit tracking, Pomodoro technique, and flashcards.

## Features
- **Notes Section:** Organize and access your study notes anytime.
- **Habit Tracker:** Maintain and track daily study habits.
- **Pomodoro Timer:** Utilize the Pomodoro technique for better focus.
- **Flashcards:** Enhance learning with AnkiPro-style flashcards.
- **Progress Tracking:** Monitor daily and weekly progress using pie charts.
- **Text Summary:** Summarize long content into short summary for user understanding.

## Tech Stack
### Frontend
- **React.js** – Used for building the user interface.
- **Tailwind CSS** – For styling and responsive design.
- **Framer Motion** – For smooth animations.

### Backend
- **Node.js & Express.js** – For handling server-side logic.
- **MongoDB** – Used for storing user data (notes, habits, progress, etc.).
- **Mongoose** – To interact with the MongoDB database.

## Installation & Setup
### Prerequisites
Ensure you have the following installed:
- Node.js
- MongoDB
- Git

### Clone the Repository
```sh
 git clone https://github.com/suhanachaudhary/focusflow.git
 cd focusflow
```

### Backend Setup
```sh
 cd backend
 npm install
 npm start
```

### Frontend Setup
```sh
 cd frontend
 npm install
 npm start
```

## Usage
1. Open `http://localhost:3000/` in your browser.
2. Register or log in to access features.
3. Start tracking your habits, taking notes, and using Pomodoro timers.
4. Monitor progress with visual analytics.

## Contributing
Feel free to contribute by forking the repository and creating pull requests.

## License
This project is open-source and available under the MIT License.
