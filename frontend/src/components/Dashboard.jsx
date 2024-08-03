import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateTaskModal from './CreateTaskModal';
import EditTaskModal from './EditTaskModal';
import './Dashboard.css';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [username, setUsername] = useState('');
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      const userResponse = await fetch('http://127.0.0.1:8000/users/me/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!userResponse.ok) {
        navigate('/login');
      } else {
        const userData = await userResponse.json();
        setUsername(userData.username);
      }
    };

    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        alert('Failed to fetch tasks');
      }
    };

    fetchUserData();
    fetchTasks();
  }, [navigate]);

  const handleDelete = async (taskId) => {
    const token = localStorage.getItem('token');
    await fetch(`http://127.0.0.1:8000/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleCreateTask = async (task) => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://127.0.0.1:8000/tasks/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(task)
    });
    if (response.ok) {
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      setCreateModalOpen(false);
    } else {
      alert('Task creation failed');
    }
  };

  const handleEditTask = async (taskId, updatedTask) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://127.0.0.1:8000/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatedTask)
    });
    if (response.ok) {
      setTasks(tasks.map(task => (task.id === taskId ? updatedTask : task)));
      setEditModalOpen(false);
    } else {
      alert('Task update failed');
    }
  };

  return (
    <div className="dashboard">
      <h1>Welcome, {username}</h1>
      <h2>Task Manager Dashboard</h2>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      <button onClick={() => setCreateModalOpen(true)} className="create-task-button">Create Task</button>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <div>
              <strong>{task.title}</strong> - {task.description}
            </div>
            <div>
              <button onClick={() => { setEditModalOpen(true); setCurrentTaskId(task.id); }}>Edit</button>
              <button onClick={() => handleDelete(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <CreateTaskModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} onCreate={handleCreateTask} />
      <EditTaskModal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} onEdit={handleEditTask} taskId={currentTaskId} />
    </div>
  );
}

export default Dashboard;
