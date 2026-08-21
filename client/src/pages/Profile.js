import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../redux/slices/authSlice';

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [name, setName] = useState(user?.name || '');
  const [ftp, setFtp] = useState(user?.ftp || '');
  const [thresholdPace, setThresholdPace] = useState(user?.thresholdPace || '');
  const [raceGoal, setRaceGoal] = useState(user?.raceGoal || '70.3');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(updateProfile({ name, ftp: Number(ftp) || null, thresholdPace, raceGoal }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h2>Profile</h2>

      <div className="card">
        <div className="stat-label" style={{ marginBottom: 12 }}>Athlete info</div>
        <form onSubmit={handleSave}>
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <select value={raceGoal} onChange={(e) => setRaceGoal(e.target.value)}>
            <option value="sprint">Sprint</option>
            <option value="olympic">Olympic</option>
            <option value="70.3">70.3 (Half Ironman)</option>
            <option value="ironman">Ironman</option>
          </select>
          <input type="number" placeholder="FTP (watts)" value={ftp} onChange={(e) => setFtp(e.target.value)} />
          <input placeholder="Threshold run pace (e.g. 4:45/km)" value={thresholdPace} onChange={(e) => setThresholdPace(e.target.value)} />
          <button type="submit">Save</button>
          {saved && <span style={{ marginLeft: 12, color: '#5aff82' }}>Saved ✓</span>}
        </form>
      </div>

      <div className="card">
        <div className="stat-label" style={{ marginBottom: 12 }}>About this app</div>
        <p style={{ color: '#8b8f9a', fontSize: 14 }}>
          Tri-Athlete stores all your data locally in this browser — no account, no server.
          Data won't sync between devices; use "Reset local data" in the sidebar to start fresh on this device.
        </p>
      </div>
    </div>
  );
}
