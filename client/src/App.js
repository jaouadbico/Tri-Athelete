import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './components/Sidebar';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Activities from './pages/Activities';
import TrainingPlan from './pages/TrainingPlan';
import Profile from './pages/Profile';

function PrivateLayout({ children }) {
  const { user } = useSelector((s) => s.auth);
  if (!user) return <Navigate to="/welcome" replace />;
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">{children}</main>
    </div>
  );
}

export default function App() {
  const { user } = useSelector((s) => s.auth);

  return (
    <Routes>
      <Route path="/welcome" element={user ? <Navigate to="/" replace /> : <Onboarding />} />
      <Route path="/" element={<PrivateLayout><Dashboard /></PrivateLayout>} />
      <Route path="/activities" element={<PrivateLayout><Activities /></PrivateLayout>} />
      <Route path="/plan" element={<PrivateLayout><TrainingPlan /></PrivateLayout>} />
      <Route path="/profile" element={<PrivateLayout><Profile /></PrivateLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
