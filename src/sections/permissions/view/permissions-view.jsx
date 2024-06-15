import axios from 'axios';
import React, { useState, useEffect } from 'react';

import { Alert, Snackbar } from '@mui/material';

import './permissions.css';

export default function PermissionsView() {
    const [permissions, setPermissions] = useState([]);
    const [title, setTitle] = useState('');
    const [code, setCode] = useState('');
    const [editId, setEditId] = useState(null);
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
    }, []);

    const fetchPermissions = async () => {
        const response = await axios.get('http://localhost:5000/api/permissions');
        setPermissions(response.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editId) {
            await axios.put(`http://localhost:5000/api/permissions/${editId}`, { title, code });
        } else {
            await axios.post('http://localhost:5000/api/permissions', { title, code });
        }
        setTitle('');
        setCode('');
        setEditId(null);
        setSnackbarMessage('Permission created successfully!');
        setSnackbarOpen(true);
        fetchPermissions();
    };

    const handleEdit = (permission) => {
        setTitle(permission.title);
        setCode(permission.code);
        setEditId(permission._id);
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:5000/api/permissions/${id}`);
        setSnackbarMessage('Permission deleted successfully!');
        setSnackbarOpen(true);
        fetchPermissions();
    };

    return (
        <div>
            <button type="button" style={buttonStyle} onClick={() => setIsFormVisible(!isFormVisible)}>New Permission</button>
            {isFormVisible && (
            <form style={formStyle} className="taskForm" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                />
                <button style={{"background-color":"rgb(50, 205, 55)"}} className='submit' type="submit">Create Permission</button>
            </form>
            )}
            <table>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Title</th>
                        <th>Code</th>
                        <th>Created</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {permissions.map((permission, index) => (
                        <tr key={permission._id}>
                            <td>{index + 1}</td>
                            <td>{permission.title}</td>
                            <td>{permission.code}</td>
                            <td>{new Date(permission.created).toLocaleString()}</td>
                            <td>
                                <button type="button" style={{"background-color":"rgb(60, 161, 194)"}} className='edit' onClick={() => handleEdit(permission)}>Edit</button>
                                <button type="button" style={{"background-color":"rgb(233, 14, 14)"}} className='delete' onClick={() => handleDelete(permission._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br />
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
            <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%', ...darkAlertStyle }}>
            {snackbarMessage}
            </Alert>
            </Snackbar>
        </div>
    );
}
