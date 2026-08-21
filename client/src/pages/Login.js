import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../redux/slices/authSlice';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((s) => s.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) navigate('/');
  };

  return (
    <div className="auth-wrap">
      <div className="card">
        <h2>Log in</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p style={{ color: '#ff5a1f' }}>{error}</p>}
          <button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        <p style={{ marginTop: 16, fontSize: 14 }}>
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
