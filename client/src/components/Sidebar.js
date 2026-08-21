import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetProfile } from '../redux/slices/authSlice';

export default function Sidebar() {
  const dispatch = useDispatch();

  const handleReset = () => {
    if (window.confirm('This clears all locally stored data on this device. Continue?')) {
      dispatch(resetProfile());
    }
  };

  return (
    <aside className="sidebar">
      <h1>🏊‍♂️🚴‍♂️🏃‍♂️ Tri-Athlete</h1>
      <nav>
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>Dashboard</NavLink>
        <NavLink to="/activities" className={({ isActive }) => (isActive ? 'active' : '')}>Activities</NavLink>
        <NavLink to="/plan" className={({ isActive }) => (isActive ? 'active' : '')}>Training Plan</NavLink>
        <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>Profile</NavLink>
      </nav>
      <button onClick={handleReset} style={{ marginTop: 24, width: '100%', background: '#2a2e38' }}>
        Reset local data
      </button>
    </aside>
  );
}
