# FitConnect - Smart Gym Buddy Finder

A full-stack web application that helps users find compatible gym partners based on fitness goals, workout schedules, experience levels, and location.

## Tech Stack

- **Frontend:** React.js (Vite), React Router, Axios, Tailwind CSS
- **Backend:** Node.js, Express.js, MongoDB, JWT Authentication, Socket.IO
- **Database:** MongoDB Atlas

## Features

- Smart compatibility-based matching (Goal 40%, Time 30%, Level 20%, City 10%)
- JWT authentication with password hashing
- Real-time chat with Socket.IO (typing indicators, online status)
- Buddy request system (send, accept, reject, remove)
- Live notifications
- Search & filter users
- Responsive design (mobile, tablet, desktop)
- Complete profile management

## Project Structure

```
fitconnect/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components (Navbar)
│   │   ├── pages/           # All page components
│   │   ├── context/         # Auth context
│   │   ├── services/        # API service layer
│   │   ├── hooks/           # Custom hooks (useSocket)
│   │   └── layouts/         # Layout components
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── server/                  # Express backend
│   ├── config/              # Database configuration
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Auth middleware
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── sockets/             # Socket.IO setup
│   ├── utils/               # Matching algorithm, seed data
│   └── server.js
├── .env.example
├── package.json             # Root scripts
└── README.md
```

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd fitconnect
   ```

2. Install root dependencies:
   ```bash
   npm install
   ```

3. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

4. Install client dependencies:
   ```bash
   cd ../client
   npm install
   ```

5. Configure environment variables:
   - Copy `.env.example` to `server/.env`
   - Add your MongoDB Atlas connection string
   - Set a JWT secret key

6. Start the development servers:
   ```bash
   # From root directory (runs both with concurrently)
   npm run dev

   # Or individually:
   cd server && npm run dev    # Backend on port 5000
   cd client && npm run dev    # Frontend on port 5173
   ```

7. Seed sample data:
   ```bash
   # With server running, visit:
   http://localhost:5000/api/seed
   ```

### Sample Accounts

After seeding, you can login with any of these:
- rahul@example.com / password123
- priya@example.com / password123
- amit@example.com / password123
- sneha@example.com / password123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Profile
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/upload` - Upload profile picture

### Matching
- `GET /api/matching/recommended` - Get recommended matches
- `GET /api/matching/filter` - Filter users

### Buddy Requests
- `POST /api/requests` - Send buddy request
- `PUT /api/requests/:id` - Accept/reject request
- `GET /api/requests/pending` - Get pending requests
- `GET /api/requests/sent` - Get sent requests
- `GET /api/requests/buddies` - Get buddies list
- `DELETE /api/requests/buddies/:buddyId` - Remove buddy

### Chat
- `GET /api/chat/conversations` - Get conversations
- `GET /api/chat/:userId` - Get messages with user
- `POST /api/chat` - Send message
- `PUT /api/chat/read/:userId` - Mark messages as read

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/read/:id` - Mark notification read
- `PUT /api/notifications/read-all` - Mark all read

## Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Set root directory to `client/`
4. Build command: `npm run build`
5. Output directory: `dist`
6. Deploy

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Root directory: `server/`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL` (your Vercel frontend URL)
7. Deploy

## Matching Algorithm

Compatibility scores are calculated based on:

| Factor | Weight | Match Condition |
|--------|--------|----------------|
| Fitness Goal | 40% | Same goal |
| Workout Time | 30% | Same time slot |
| Experience Level | 20% | Same level |
| City | 10% | Same city |

## License

MIT
