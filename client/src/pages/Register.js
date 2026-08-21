import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../redux/slices/authSlice';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((s) => s.auth);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register(form));
    if (register.fulfilled.match(result)) navigate('/');
  };

  return (
    <div className="auth-wrap">
      <div className="card">
        <h2>Create account</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={handleChange} required />
          {error && <p style={{ color: '#ff5a1f' }}>{error}</p>}
          <button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Creating...' : 'Create account'}
          </button>
        </form>
        <p style={{ marginTop: 16, fontSize: 14 }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
