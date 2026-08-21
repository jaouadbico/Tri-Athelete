# Tri-Athlete

A personal triathlon training tracker — log swim/bike/run activities, generate a periodized training plan, and see your weekly stats. Runs entirely in the browser (React + Redux), no server or account required. All data is stored locally on your device.

**Live app:** https://jaouadbico.github.io/Tri-Athelete

## Features

- Log swim/bike/run/brick/strength activities
- Auto-generated periodized training plans (base → build → peak → taper) for sprint, olympic, 70.3, and full Ironman
- Weekly training summary dashboard with charts
- Local athlete profile with FTP / threshold pace
- Works on desktop and mobile browsers — add it to your phone's home screen for an app-like feel

## Tech Stack

- React 18, Redux Toolkit, React Router (HashRouter), Recharts
- Data persistence: browser `localStorage` (no backend, no database)
- Deployment: GitHub Actions → GitHub Pages

## Run locally

```
cd client
npm install
npm start
```
Opens at http://localhost:3000

## Deploy

Every push to `main` automatically builds and deploys to GitHub Pages via the workflow in `.github/workflows/deploy.yml`. First-time setup: in the repo, go to **Settings → Pages → Source** and select **GitHub Actions**.

You can also deploy manually:
```
cd client
npm run deploy
```

## A note on data

Since there's no backend, your activities and training plan live only in this browser's local storage. They won't sync between your phone and computer, and clearing browser data will erase them. Use "Reset local data" in the sidebar to start fresh.

## Project Structure

```
Tri-Athelete/
├── .github/workflows/deploy.yml   # Auto-deploy to GitHub Pages
├── client/
│   └── src/
│       ├── components/            # Sidebar, shared UI
│       ├── pages/                 # Onboarding, Dashboard, Activities, TrainingPlan, Profile
│       ├── redux/                 # Redux Toolkit store + slices
│       └── services/storage.js    # localStorage persistence layer
└── README.md
```

## License

MIT
