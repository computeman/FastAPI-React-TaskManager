import React, { useState, useEffect } from 'react';
import './EditTaskModal.css'; // Import the CSS file for the modal

function EditTaskModal({ isOpen, onClose, onEdit, taskId }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (taskId) {
      const fetchTask = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://127.0.0.1:8000/tasks/${taskId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setTitle(data.title);
        setDescription(data.description);
      };

      fetchTask();
    }
  }, [taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onEdit(taskId, { title, description });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit">Update Task</button>
        </form>
      </div>
    </div>
  );
}

export default EditTaskModal;
