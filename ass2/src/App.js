import React, { useState, useEffect } from 'react';
import axios from 'axios';


const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTask = async () => {
    if (taskInput.trim() !== '') {
      try {
        await axios.post('http://localhost:5000/tasks', { task: taskInput });
        fetchTasks();
        setTaskInput('');
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const handleDeleteTask = async (index) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${index}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className='container'>
      <h1>To-Do App</h1>
      <div className='main'>
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder="Enter a new task"
        />
        <button className='add' onClick={handleAddTask}>Add Task</button>
      </div>
      <div className='task'>
        <h2>Tasks</h2>
        <ul>
          {tasks.map((task, index) => (
            <li key={index} className='task-item'>
              {task}
              <button className='delete' onClick={() => handleDeleteTask(index)}>Delete</button>
            </li>
          ))}
        </ul>
        {tasks.length === 0 && <p>No tasks available.</p>}
      </div>
    </div>
  );
};

export default App;
