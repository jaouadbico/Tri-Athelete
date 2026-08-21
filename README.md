# Tri-Athlete

AI-ready personalized triathlon training platform — track swim/bike/run activities, generate periodized training plans, and sync with Strava.

## Features

- Track training activities for swimming, biking, and running (manual entry or Strava sync)
- Auto-generated periodized training plans (base → build → peak → taper) for sprint, olympic, 70.3, and full Ironman distances
- Weekly training summary dashboard with charts
- User authentication (JWT) and profile management with FTP / threshold pace tracking
- Strava OAuth integration for activity import

## Tech Stack

- **Frontend:** React 18, Redux Toolkit, React Router, Recharts
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT + bcrypt

## Quick Start

1. Clone the repository:
   ```
   git clone https://github.com/jaouadbico/Tri-Athelete.git
   cd Tri-Athelete
   ```

2. Install dependencies:
   ```
   npm run install-all
   ```

3. Set up environment variables:
   ```
   cp .env.example .env
   ```
   Fill in `MONGO_URI`, `JWT_SECRET`, and (optionally) `STRAVA_CLIENT_ID` / `STRAVA_CLIENT_SECRET`.

4. Run the app in development (client + server concurrently):
   ```
   npm run dev
   ```
   - API: http://localhost:5000
   - Client: http://localhost:3000

## Project Structure

```
Tri-Athelete/
├── client/                # React frontend
│   └── src/
│       ├── components/    # Shared UI (Sidebar, etc.)
│       ├── pages/         # Dashboard, Activities, TrainingPlan, Profile, Login/Register
│       ├── redux/         # Redux Toolkit store + slices
│       └── services/      # Axios API client
├── server/                 # Node/Express backend
│   ├── config/             # DB connection
│   ├── controllers/        # Route handlers
│   ├── middleware/         # JWT auth middleware
│   ├── models/              # Mongoose schemas (User, Activity, TrainingPlan)
│   ├── routes/               # Express routers
│   └── index.js              # Server entry point
└── README.md
```

## API Overview

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Log in, get JWT |
| GET/PUT | `/api/auth/me` | Get/update profile |
| GET/POST | `/api/activities` | List/create activities |
| GET | `/api/activities/summary?days=7` | Sport-grouped summary |
| GET | `/api/plans` | List training plans |
| POST | `/api/plans/generate` | Generate a periodized plan |
| PUT | `/api/plans/:planId/workouts/:workoutId` | Mark workout complete |
| POST | `/api/strava/connect` | Exchange OAuth code |
| POST | `/api/strava/sync` | Import recent Strava activities |

## License

MIT
