import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setupProfile } from '../redux/slices/authSlice';

export default function Onboarding() {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [raceGoal, setRaceGoal] = useState('70.3');

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setupProfile({ name, raceGoal }));
  };

  return (
    <div className="auth-wrap">
      <div className="card">
        <h2>Welcome to Tri-Athlete</h2>
        <p style={{ color: '#8b8f9a', fontSize: 14 }}>
          Your data stays on this device (browser local storage) — no account needed.
        </p>
        <form onSubmit={handleSubmit}>
          <input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
          <select value={raceGoal} onChange={(e) => setRaceGoal(e.target.value)}>
            <option value="sprint">Sprint</option>
            <option value="olympic">Olympic</option>
            <option value="70.3">70.3 (Half Ironman)</option>
            <option value="ironman">Ironman</option>
          </select>
          <button type="submit">Get started</button>
        </form>
      </div>
    </div>
  );
}
