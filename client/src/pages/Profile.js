import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';

export default function Profile() {
  const { user } = useSelector((s) => s.auth);
  const [ftp, setFtp] = useState(user?.ftp || '');
  const [thresholdPace, setThresholdPace] = useState(user?.thresholdPace || '');
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    await api.put('/auth/me', { ftp: Number(ftp) || undefined, thresholdPace });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h2>Profile</h2>
      <div className="card">
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
      </div>

      <div className="card">
        <div className="stat-label" style={{ marginBottom: 12 }}>Training thresholds</div>
        <form onSubmit={handleSave}>
          <input type="number" placeholder="FTP (watts)" value={ftp} onChange={(e) => setFtp(e.target.value)} />
          <input placeholder="Threshold run pace (e.g. 4:45/km)" value={thresholdPace} onChange={(e) => setThresholdPace(e.target.value)} />
          <button type="submit">Save</button>
          {saved && <span style={{ marginLeft: 12, color: '#5aff82' }}>Saved ✓</span>}
        </form>
      </div>

      <div className="card">
        <div className="stat-label" style={{ marginBottom: 12 }}>Integrations</div>
        <p style={{ color: '#8b8f9a', fontSize: 14 }}>
          Strava connection status: {user?.stravaConnected ? 'Connected ✓' : 'Not connected'}
        </p>
      </div>
    </div>
  );
}
