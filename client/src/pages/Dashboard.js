import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchSummary, fetchActivities } from '../redux/slices/activitySlice';

function formatDistance(meters, sport) {
  if (sport === 'swim') return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export default function Dashboard() {
  const dispatch = useDispatch();
  const { summary, list } = useSelector((s) => s.activities);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchSummary(7));
    dispatch(fetchActivities());
  }, [dispatch]);

  const chartData = (summary?.summary || []).map((s) => ({
    sport: s._id,
    hours: +(s.totalTimeSeconds / 3600).toFixed(1),
  }));

  return (
    <div>
      <h2>Welcome back{user?.name ? `, ${user.name}` : ''} 👋</h2>

      <div className="grid">
        {(summary?.summary || []).map((s) => (
          <div className="card" key={s._id}>
            <div className="stat-label">{s._id} — last 7 days</div>
            <div className="stat-value">{formatDistance(s.totalDistanceMeters, s._id)}</div>
            <div style={{ color: '#8b8f9a', fontSize: 13 }}>{s.sessionCount} sessions</div>
          </div>
        ))}
        {(!summary?.summary || summary.summary.length === 0) && (
          <div className="card">
            <p>No activities logged yet. Head to Activities to add your first swim, bike, or run.</p>
          </div>
        )}
      </div>

      {chartData.length > 0 && (
        <div className="card" style={{ height: 280, marginTop: 20 }}>
          <div className="stat-label" style={{ marginBottom: 12 }}>Training hours by sport (7d)</div>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262a33" />
              <XAxis dataKey="sport" stroke="#8b8f9a" />
              <YAxis stroke="#8b8f9a" />
              <Tooltip contentStyle={{ background: '#171a21', border: 'none' }} />
              <Bar dataKey="hours" fill="#ff5a1f" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="card">
        <div className="stat-label" style={{ marginBottom: 12 }}>Recent activity</div>
        <table>
          <thead>
            <tr><th>Sport</th><th>Name</th><th>Date</th><th>Distance</th></tr>
          </thead>
          <tbody>
            {list.slice(0, 5).map((a) => (
              <tr key={a._id}>
                <td><span className={`badge ${a.sport}`}>{a.sport}</span></td>
                <td>{a.name}</td>
                <td>{new Date(a.startDate).toLocaleDateString()}</td>
                <td>{formatDistance(a.distanceMeters, a.sport)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
