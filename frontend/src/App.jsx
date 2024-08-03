import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import CreateTaskModal from './components/CreateTaskModal';
import EditTaskModal from './components/EditTaskModal';
import './App.css'

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-task" element={<CreateTaskModal />} />
          <Route path="/edit-task/:id" element={<EditTaskModal />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
