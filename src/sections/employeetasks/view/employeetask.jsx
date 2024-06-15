import axios from 'axios';
import React, { useState, useEffect } from 'react';

import './employeetask.css';

const Employeetask = () => {
  const [tasks, setTasks] = useState([]);
  const role = localStorage.getItem('role');

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data); 
    };
    fetchTasks();
  }, []); 

  const handleStatusChange = async (taskId, newStatus) => {
    const updatedTasks = tasks.map(task => {
      if (task._id === taskId) {
        return { ...task, task_status: newStatus };
      }
      return task;
    });
    setTasks(updatedTasks);
    await axios.put(`http://localhost:5000/api/tasks/${taskId}`, { task_status: newStatus });
  };

  return (
    <div>
      <h2>Your Tasks</h2>
          {tasks.map((task) => (
            task.assigned_to===role? 
            <ul>
            <div className="tasks">
            <div key={task._id}>
            Type: {task.type_of_task} <br />
            Title: {task.title} <br />
            Description: {task.description} <br />
            Task Status: <select
              value={task.task_status}
              onChange={(e) => handleStatusChange(task._id, e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Ready to Inspect">Ready to Inspect</option>
              <option value="Completed">Completed</option>
            </select> <br />
            Comments: {task.comments} <br />
            Room ID: {task.room_id} <br />
            Subtasks: {task.subtasks.map((subtask, index) => (
              <div>
                  {index + 1} : {subtask.description}
              </div>
            ))} 
            Created: {task.created} <br />
          </div>
            </div> </ul> 
            : null
          ))}
    </div>
  );
}

export default Employeetask;