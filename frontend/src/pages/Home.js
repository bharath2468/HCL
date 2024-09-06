import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/App.css'; // Assuming you want to style this component

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Hospital Record Management System</h1>
        <p>Your comprehensive solution for managing hospital records efficiently.</p>
      </header>
      <main className="home-main">
        <div className="home-info">
          <h2>Features</h2>
          <ul>
            <li>Manage patient records securely</li>
            <li>Track appointments and medical history</li>
            <li>Access and update records from anywhere</li>
            <li>Generate reports and analytics</li>
          </ul>
        </div>
        <div className="home-actions">
          <h2>Get Started</h2>
          <p>
            <Link to="/login" className="home-link">Login</Link> to access your dashboard or
            <Link to="/signup" className="home-link">Sign Up</Link> to create a new account.
          </p>
        </div>
      </main>
      <footer className="home-footer">
        <p>&copy; 2024 Hospital Record System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
