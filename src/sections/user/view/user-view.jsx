// 
import axios from 'axios';
import React, { useState, useEffect } from 'react';

import { Alert, Snackbar } from '@mui/material';

import './user.css'

const UserView = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const darkAlertStyle = {
    backgroundColor: '#333', 
    color: 'white', 
  };

  const buttonStyle = {
    backgroundColor: "#5597de",
    color: "white",
    padding: "10px 20px",
    margin: "20px 0",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    fontSize: "16px",
  };

  const formStyle = {
    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
    transition: "0.3s",
    borderRadius: "5px",
    padding: "20px",
    backgroundColor: "#f2f2f2",
  };

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    role: '',
    email: '',
    contact: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    const response = await axios.get('http://localhost:5000/api/users');
    setUsers(response.data);
  };

  const fetchRoles = async () => {
    const response = await axios.get('http://localhost:5000/api/roles');
    setRoles(response.data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
    }
    await axios.post('http://localhost:5000/api/users', formData);
    setSnackbarMessage('User created successfully!');
    setSnackbarOpen(true);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/users/${id}`);
    setSnackbarMessage('User deleted successfully!');
    setSnackbarOpen(true);
    fetchUsers();
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      username: user.username,
      role: '',
      email: '',
      contact: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div>
      <button type="button" style={buttonStyle} onClick={() => setIsFormVisible(!isFormVisible)}>New User</button>
      {isFormVisible && (
      <form style={formStyle} className="taskForm" onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" onChange={handleChange} value={formData.name} required />
        <input name="username" placeholder="Username" onChange={handleChange} value={formData.username} required />
        <select style={{"margin-right":"10px"}} name="role" onChange={handleChange} value={formData.role} required>
          <option value="" disabled>Select Role</option>
          {roles.map(role => (
            <option key={role._id} value={role.roleName}>{role.roleName}</option>
          ))}
        </select>
        <input name="email" placeholder="Email" type="email" onChange={handleChange} value={formData.email} required />
        <input name="contact" placeholder="Contact" onChange={handleChange} value={formData.contact} required />
        <input name="password" placeholder="Password" type="password" onChange={handleChange} value={formData.password} required />
        <input style={{"margin-top":"10px"}} name="confirmPassword" placeholder="Confirm Password" type="password" onChange={handleChange} value={formData.confirmPassword} required />
        <button style={{"background-color":"rgb(50, 205, 55)"}} type="submit">Create User</button>
      </form>
      )}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.contact}</td>
              <td>{user.role}</td>
              <td>
                <button type="button" style={{"background-color":"rgb(60, 161, 194)","margin-right": "10px","margin-left":"10px"}} onClick={() => handleEdit(user)}>Edit</button>
                <button type="button" style={{"background-color":"rgb(233, 14, 14)"}} onClick={() => handleDelete(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
            <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%', ...darkAlertStyle }}>
            {snackbarMessage}
            </Alert>
            </Snackbar>
    </div>
  );
};

export default UserView;