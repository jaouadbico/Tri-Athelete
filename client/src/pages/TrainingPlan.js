import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlans, generatePlan, toggleWorkout } from '../redux/slices/planSlice';

export default function TrainingPlan() {
  const dispatch = useDispatch();
  const { list } = useSelector((s) => s.plans);
  const [raceType, setRaceType] = useState('70.3');
  const [raceDate, setRaceDate] = useState('');
  const [weeks, setWeeks] = useState(12);

  useEffect(() => {
    dispatch(fetchPlans());
  }, [dispatch]);

  const activePlan = list.find((p) => p.active) || list[0];

  const handleGenerate = async (e) => {
    e.preventDefault();
    await dispatch(generatePlan({ raceType, raceDate, weeks: Number(weeks) }));
  };

  const groupedByWeek = (workouts = []) => {
    const groups = {};
    workouts.forEach((w) => {
      const weekStart = new Date(w.date);
      const weekNum = Math.floor((new Date(w.date) - new Date(workouts[0].date)) / (7 * 24 * 60 * 60 * 1000)) + 1;
      groups[weekNum] = groups[weekNum] || [];
      groups[weekNum].push(w);
    });
    return groups;
  };

  return (
    <div>
      <h2>Training Plan</h2>

      <div className="card">
        <div className="stat-label" style={{ marginBottom: 12 }}>Generate a new plan</div>
        <form onSubmit={handleGenerate}>
          <select value={raceType} onChange={(e) => setRaceType(e.target.value)}>
            <option value="sprint">Sprint</option>
            <option value="olympic">Olympic</option>
            <option value="70.3">70.3 (Half Ironman)</option>
            <option value="ironman">Ironman</option>
          </select>
          <input type="date" value={raceDate} onChange={(e) => setRaceDate(e.target.value)} required />
          <input type="number" min={4} max={52} value={weeks} onChange={(e) => setWeeks(e.target.value)} placeholder="Weeks" />
          <button type="submit">Generate plan</button>
        </form>
      </div>

      {activePlan ? (
        <div className="card">
          <div className="stat-label">{activePlan.name}</div>
          <p style={{ color: '#8b8f9a', fontSize: 13 }}>
            Race date: {activePlan.raceDate ? new Date(activePlan.raceDate).toLocaleDateString() : 'TBD'}
          </p>
          {Object.entries(groupedByWeek(activePlan.workouts)).slice(0, 4).map(([week, workouts]) => (
            <div key={week} style={{ marginBottom: 16 }}>
              <strong>Week {week}</strong>
              <table>
                <tbody>
                  {workouts.map((w) => (
                    <tr key={w._id}>
                      <td><span className={`badge ${w.sport}`}>{w.sport}</span></td>
                      <td>{w.title}</td>
                      <td>{new Date(w.date).toLocaleDateString(undefined, { weekday: 'short' })}</td>
                      <td>{w.durationMinutes ? `${w.durationMinutes} min` : '-'}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={w.completed}
                          onChange={() =>
                            dispatch(toggleWorkout({ planId: activePlan._id, workoutId: w._id, completed: !w.completed }))
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ) : (
        <div className="card"><p>No plan yet — generate one above to get your periodized swim/bike/run schedule.</p></div>
      )}
    </div>
  );
}
