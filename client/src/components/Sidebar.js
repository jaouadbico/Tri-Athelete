import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
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
      <button onClick={handleLogout} style={{ marginTop: 24, width: '100%' }}>Log out</button>
    </aside>
  );
}
