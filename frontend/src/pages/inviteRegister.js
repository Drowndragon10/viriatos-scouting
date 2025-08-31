import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const InviteRegister = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const apiUrl = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  const { token } = useParams();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setSuccess('');
      return;
    }

    try {
      await axios.post(`${apiUrl}/auth/registerInvite`, {
        inviteToken: token,
        name,
        password,
      });

      setSuccess('Account created successfully! You can now log in.');
      setError('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Invalid or expired token.');
      setSuccess('');
    }
  };

  return (
    <div className="container-fluid p-0 d-flex min-vh-100">
      {/* Left Panel */}
      <div className="col-lg-5 col-md-12 p-0" style={{ backgroundColor: '#121212' }}>
        <div className="text-center text-light d-flex justify-content-center align-items-center min-vh-100">
          <div>
            <h1>
              Viriatos <span className="text-warning scouting">Scouting</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div
        className="col-lg-7 col-md-12 d-flex justify-content-center align-items-center"
        style={{ backgroundColor: '#2a2a2a' }}
      >
        <div className="register-form text-light p-4 w-100" style={{ maxWidth: '400px' }}>
          <h2 className="mb-4 text-center">Register</h2>
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  backgroundColor: '#121212',
                  opacity: '0.4',
                  border: 'none',
                  color: 'white',
                }}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  backgroundColor: '#121212',
                  opacity: '0.4',
                  border: 'none',
                  color: 'white',
                }}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{
                  backgroundColor: '#121212',
                  opacity: '0.4',
                  border: 'none',
                  color: 'white',
                }}
              />
            </div>
            <button type="submit" className="btn btn-warning w-100 mt-3" style={{ color: 'white' }}>
              Register
            </button>

            {error && <p className="text-danger mt-3">{error}</p>}
            {success && <p className="text-success mt-3">{success}</p>}
          </form>

          <div className="mt-3 text-end">
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'none',
                border: 'none',
                textDecoration: 'underline',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              Already have an account? Login!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteRegister;
