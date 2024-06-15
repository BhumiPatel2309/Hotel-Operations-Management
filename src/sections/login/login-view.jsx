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
    <div className="login-container">
      <div className = "username">
    Username
    </div>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <div className = "password">
      Password
      </div>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className='button-container'>
      <button type="button" onClick={handleLogin}>Login</button>
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