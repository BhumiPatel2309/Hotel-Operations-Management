import axios from 'axios';
import React, { useState } from 'react';

import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import { useRouter } from 'src/routes/hooks';

import './login-view.css';

const LoginView = () => {
  const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [open, setOpen] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');

    const router = useRouter();
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpen(false);
    };

    const alertStyle = {
      backgroundColor: 'red', 
      color: 'white', 
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:5000/api/login', { username, password });
            console.log(res.data.role);
            console.log("Login successful!")
            localStorage.setItem('role', res.data.role)
            router.push('/dashboard');
        } catch (err) {
          setErrorMessage("Invalid credentials");
          setOpen(true);
          console.log("Invalid credentials");
        }
  };

  return (
    <div className="login-container" style={{ padding: '20px', maxWidth: '400px', margin: 'auto', marginTop: '50px', backgroundColor: '#f3f4f6', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
  <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>Welcome to Hotel Operations Management!</h2>
  <div className="username" style={{ marginTop: '20px', textAlign: 'center' }}>
  Username
  </div>
  <input
    type="text"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    style={{ margin: '10px 0', padding: '10px', width: 'calc(100% - 20px)', boxSizing: 'border-box' }}
  />
<div className="password" style={{ marginTop: '20px', textAlign: 'center' }}>
Password
  </div>
  <input
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    style={{ margin: '10px 0', padding: '10px', width: 'calc(100% - 20px)', boxSizing: 'border-box' }}
  />
  <div style={{ textAlign: 'center', marginTop: '20px' }}> {/* Center-align the button */}
  <button type="button" onClick={handleLogin} style={{ padding: '10px 40px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Login</button>
  </div>
  <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
    <MuiAlert onClose={handleClose} severity="error" sx={{ width: '100%', ...alertStyle }} elevation={10} variant="filled">
      {errorMessage}
    </MuiAlert>
  </Snackbar>
</div>
  );
};

export default LoginView;