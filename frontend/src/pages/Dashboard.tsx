import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';

interface Content {
  id: number;
  title: string;
  description: string;
  type: string;
  created_at: string;
}

interface DashboardProps {
  onLogout: () => void;
}

function Dashboard({ onLogout }: DashboardProps) {
  const [content, setContent] = useState<Content[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('reel');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axios.get(`${API_URL}/content`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContent(response.data);
    } catch (err: any) {
      setError('Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      setError('Title is required');
      return;
    }

    try {
      await axios.post(
        `${API_URL}/content`,
        { title, description, type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle('');
      setDescription('');
      await fetchContent();
    } catch (err: any) {
      setError('Failed to create content');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/content/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchContent();
    } catch (err: any) {
      setError('Failed to delete content');
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Astrio Dashboard</h1>
        <div className="header-right">
          <span>Welcome, {user.username}!</span>
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="create-content-card">
          <h2>Create New Content</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="reel">Reel</option>
              <option value="post">Post</option>
              <option value="story">Story</option>
            </select>
            {error && <div className="error">{error}</div>}
            <button type="submit">Create</button>
          </form>
        </div>

        <div className="content-list">
          <h2>Your Content ({content.length})</h2>
          {loading ? (
            <p>Loading...</p>
          ) : content.length === 0 ? (
            <p>No content yet. Create one!</p>
          ) : (
            content.map((item) => (
              <div key={item.id} className="content-card">
                <h3>{item.title}</h3>
                <p className="type-badge">{item.type}</p>
                <p>{item.description}</p>
                <small>{new Date(item.created_at).toLocaleDateString()}</small>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
