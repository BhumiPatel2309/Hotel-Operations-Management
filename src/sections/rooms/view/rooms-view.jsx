import axios from 'axios';
import React, { useState, useEffect } from 'react';

import { Alert, Snackbar } from '@mui/material';

import './rooms.css';

const RoomsView = () => {
  const [rooms, setRooms] = useState([]);
  const [roomNo, setRoomNo] = useState('');
  const [roomType, setRoomType] = useState('');
  const [roomStatus, setRoomStatus] = useState('available');
  const [carpetArea, setCarpetArea] = useState('');
  const [editingRoom, setEditingRoom] = useState(null);
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
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const res = await axios.get('http://localhost:5000/api/rooms');
    setRooms(res.data);
  };

  const addRoom = async () => {
    const newRoom = { roomNo, roomType, roomStatus, carpetArea };
    await axios.post('http://localhost:5000/api/rooms/add', newRoom);
    setSnackbarMessage('Room created successfully!');
    setSnackbarOpen(true);
    fetchRooms();
    resetForm();
  };

  const updateRoom = async () => {
    await axios.put(`http://localhost:5000/api/rooms/${editingRoom._id}`, { roomNo, roomType, roomStatus, carpetArea });
    fetchRooms();
    resetForm();
  };

  const deleteRoom = async (id) => {
    await axios.delete(`http://localhost:5000/api/rooms/${id}`);
    setSnackbarMessage('Room deleted successfully!');
    setSnackbarOpen(true);
    fetchRooms();
  };

  const editRoom = (room) => {
    setRoomNo(room.roomNo);
    setRoomType(room.roomType);
    setRoomStatus(room.roomStatus);
    setCarpetArea(room.carpetArea);
    setEditingRoom(room);
  };

  const resetForm = () => {
    setRoomNo('');
    setRoomType('');
    setRoomStatus('available');
    setCarpetArea('');
    setEditingRoom(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingRoom) {
      updateRoom();
    } else {
      addRoom();
    }
  };

  return (
    <div>
      <button type="button" style={buttonStyle} onClick={() => setIsFormVisible(!isFormVisible)}>New Room</button>
      {isFormVisible && (
      <form style={formStyle} className="taskForm" onSubmit={handleSubmit}>
      <input type="text" placeholder="Room No." value={roomNo} onChange={(e) => setRoomNo(e.target.value)} required />
          <input type="text" placeholder="Room Type" value={roomType} onChange={(e) => setRoomType(e.target.value)} required />
          <select value={roomStatus} onChange={(e) => setRoomStatus(e.target.value)} required>
           <option value="" disabled>Select Room Status</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
            <option value="occupied">Occupied</option>
            <option value="clean">Clean</option>
            <option value="unclean">Unclean</option>
          </select>
          <input style={{"margin-left":"10px"}} type="number" placeholder="Carpet Area" value={carpetArea} onChange={(e) => setCarpetArea(e.target.value)} required />
        <button type="submit" style={{"background-color":"rgb(50, 205, 55)"}} >Enter details</button>
      </form>
      )}
      <table>
        <thead>
          <tr>
            <th>Room No</th>
            <th>Room Type</th>
            <th>Room Status</th>
            <th>Carpet Area</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room._id}>
              <td>{room.roomNo}</td>
              <td>{room.roomType}</td>
              <td>{room.roomStatus}</td>
              <td>{room.carpetArea}</td>
              <td>
                <button type="button" style={{"background-color":"rgb(60, 161, 194)"}} onClick={() => editRoom(room)}>Edit</button>
                <button type="button" style={{"background-color":"rgb(233, 14, 14)"}} onClick={() => deleteRoom(room._id)}>Delete</button>
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

export default RoomsView;
