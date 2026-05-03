import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import './styles/App.css';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={token ? <Navigate to="/" /> : <Login setToken={setToken} />}
      />
      <Route
        path="/signup"
        element={token ? <Navigate to="/" /> : <Signup setToken={setToken} />}
      />
      <Route
        path="/"
        element={token ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default App;
