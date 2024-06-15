import axios from 'axios';
import React, { useState, useEffect } from 'react';

import { Alert, Snackbar } from '@mui/material';

import './roles.css';

export default function RolesView() {
  const [roleName, setRoleName] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showPermissions, setShowPermissions] = useState(false);
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

  useEffect(() => {
    fetchPermissions();
    fetchRoles();
  }, []);

  const fetchPermissions = async () => {
    const response = await axios.get('http://localhost:5000/api/permissions');
    setPermissions(response.data);
  };

  const fetchRoles = async () => {
    const response = await axios.get('http://localhost:5000/api/roles');
    setRoles(response.data);
  };

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/roles', { roleName, permissions: selectedPermissions });
    setRoleName('');
    setSelectedPermissions([]);
    setSnackbarMessage('Role created successfully!');
    setSnackbarOpen(true);
    fetchRoles();
  };

  const handleRoleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/roles/${id}`);
    setSnackbarMessage('Role deleted successfully!');
    setSnackbarOpen(true); 
    fetchRoles();
  };

  const handleRoleUpdate = async (id, newRoleName, newPermissions) => {
    await axios.put(`http://localhost:5000/api/roles/${id}`, { roleName: newRoleName, permissions: newPermissions });
    fetchRoles();
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setSelectedPermissions(
      checked
        ? [...selectedPermissions, value]
        : selectedPermissions.filter((permission) => permission !== value)
    );
  };

  return (
    <div>
      <button type="button" style={buttonStyle} onClick={() => setIsFormVisible(!isFormVisible)}>New Role</button>
      {isFormVisible && (
      <form style={formStyle} className="taskForm" onSubmit={handleRoleSubmit}>
        <input 
          type="text" 
          placeholder="Role Name" 
          value={roleName} 
          onChange={(e) => setRoleName(e.target.value)} 
          required 
        />
        <button type="button" onClick={() => setShowPermissions(!showPermissions)}>
    Show Permissions
  </button>
  {showPermissions && (
    <div className='list'>
      {permissions.map((permission) => (
        <div key={permission._id}>
          <input 
            type="checkbox" 
            value={permission._id} 
            onChange={handleCheckboxChange} 
          />
          {permission.title}
        </div>
      ))}
      <button style={{"background-color":"rgb(50, 205, 55)"}} type="submit">Create Role</button>
    </div>
  )}
      </form>
       )}
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Role Name</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role, index) => (
            <tr key={role._id}>
              <td>{index + 1}</td>
              <td>{role.roleName}</td>
              <td>{new Date(role.created).toLocaleString()}</td>
              <td>
                <button type="button" style={{"background-color":"rgb(60, 161, 194)"}} className='edit' onClick={() => handleRoleUpdate(role._id, prompt('New Role Name:', role.roleName), prompt('New Permissions:', role.permissions))}>Edit</button>
                <button type="button" style={{"background-color":"rgb(233, 14, 14)"}} className='delete' onClick={() => handleRoleDelete(role._id)}>Delete</button>
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
}