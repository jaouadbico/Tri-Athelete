import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivities, addActivity } from '../redux/slices/activitySlice';

const emptyForm = {
  sport: 'run',
  name: '',
  startDate: new Date().toISOString().slice(0, 10),
  distanceMeters: '',
  movingTimeSeconds: '',
  notes: '',
};

export default function Activities() {
  const dispatch = useDispatch();
  const { list } = useSelector((s) => s.activities);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchActivities());
  }, [dispatch]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(addActivity({
      ...form,
      distanceMeters: Number(form.distanceMeters) || 0,
      movingTimeSeconds: Number(form.movingTimeSeconds) || 0,
    }));
    setForm(emptyForm);
    setShowForm(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Activities</h2>
        <button onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ Log Activity'}</button>
      </div>

      {showForm && (
        <div className="card">
          <form onSubmit={handleSubmit}>
            <select name="sport" value={form.sport} onChange={handleChange}>
              <option value="swim">Swim</option>
              <option value="bike">Bike</option>
              <option value="run">Run</option>
              <option value="brick">Brick</option>
              <option value="strength">Strength</option>
            </select>
            <input name="name" placeholder="Activity name" value={form.name} onChange={handleChange} required />
            <input name="startDate" type="date" value={form.startDate} onChange={handleChange} required />
            <input name="distanceMeters" type="number" placeholder="Distance (meters)" value={form.distanceMeters} onChange={handleChange} />
            <input name="movingTimeSeconds" type="number" placeholder="Moving time (seconds)" value={form.movingTimeSeconds} onChange={handleChange} />
            <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} rows={3} />
            <button type="submit">Save activity</button>
          </form>
        </div>
      )}

      <div className="card">
        <table>
          <thead>
            <tr><th>Sport</th><th>Name</th><th>Date</th><th>Distance</th><th>Time</th></tr>
          </thead>
          <tbody>
            {list.map((a) => (
              <tr key={a._id}>
                <td><span className={`badge ${a.sport}`}>{a.sport}</span></td>
                <td>{a.name}</td>
                <td>{new Date(a.startDate).toLocaleDateString()}</td>
                <td>{a.sport === 'swim' ? `${a.distanceMeters} m` : `${(a.distanceMeters / 1000).toFixed(1)} km`}</td>
                <td>{Math.round(a.movingTimeSeconds / 60)} min</td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td colSpan={5} style={{ color: '#8b8f9a' }}>No activities yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
