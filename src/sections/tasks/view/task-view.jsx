import axios from 'axios';
import React, { useState, useEffect } from 'react';

import { Alert, Snackbar } from '@mui/material';

import './task.css';

function TasksView() {
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

  const [form, setForm] = useState({
    type_of_task: '',
    title: '',
    description: '',
    created_by: localStorage.getItem('role'),
    assigned_by: localStorage.getItem('role'),
    assigned_to: '',
    task_status: '',
    comments: '',
    room_id: '',
    subtasks: [{ description: '' }]
  });

  const [tasks, setTasks] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const addSubtask = () => {
    setForm(prevState => ({
      ...prevState,
      subtasks: [...prevState.subtasks, { description: '' }]
    }));
  };

const handleSubtaskChange = (index, e) => {
  const newSubtasks = form.subtasks.map((subtask, sIndex) => {
      if (index === sIndex) {
          return { ...subtask, description: e.target.value };
      }
      return subtask;
  });
  setForm({ ...form, subtasks: newSubtasks });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post('http://localhost:5000/api/tasks', form);
    setSnackbarMessage('Task assigned successfully!');
    setSnackbarOpen(true);
    setTasks([...tasks, response.data]);
    setForm({
      type_of_task: '',
      title: '',
      description: '',
      created_by: '',
      assigned_by: '',
      assigned_to: '',
      task_status: 'pending',
      comments: '',
      room_id: '',
      subtasks: [{ description: '' }]
    });
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data);
    };
    fetchTasks();
  }, []);

  return (
    <div>
      <button type="button" style={buttonStyle} onClick={() => setIsFormVisible(!isFormVisible)}>New Task</button>
      {isFormVisible && (
      <form style={formStyle} className="taskForm" onSubmit={handleSubmit}>
        <select name="type_of_task" value={form.type_of_task} onChange={handleChange}>
          <option value="">Type of Task</option>
          <option value="dynamic">dynamic</option>
          <option value="static">static</option>
        </select>
        <input style={{"margin-left":"10px"}} type="text" name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
        <textarea style={{"margin-right":"10px","margin-top":"20px"}} name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
        <select name="assigned_to" value={form.assigned_to} onChange={handleChange}>
        <option value="">Assigned to</option>
          <option value="Housekeeper">Housekeeper</option>
          <option value="Frontdesk">Frontdesk</option>
          <option value="Maintenance">Maintenance</option>
        </select>
        <textarea style={{"margin-left":"10px","margin-top":"20px"}} name="comments" value={form.comments} onChange={handleChange} placeholder="Comments" />
        <input style={{"margin-left":"10px"}} type="text" name="room_id" value={form.room_id} onChange={handleChange} placeholder="Room ID (if applicable)" />
        <div>
                    {form.subtasks.map((subtask, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                placeholder="Subtask Description"
                                value={subtask.description}
                                onChange={(e) => handleSubtaskChange(index, e)}
                            />
                            <button type="button" onClick={addSubtask}>+</button>
                        </div>
                    ))}
                    
                </div>
        <button style={{"margin-top":"10px","background-color":"rgb(50, 205, 55)"}} type="submit">Create Task</button>
      </form>
)}
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Type of Task</th>
            <th>Title</th>
            <th>Description</th>
            <th>Task Status</th>
            <th>Assigned to</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={task._id}>
              <td>{index + 1}</td>
              <td>{task.type_of_task}</td>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.task_status===""? 'Pending' : task.task_status}</td>
              <td>{task.assigned_to}</td>
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

export default TasksView;
