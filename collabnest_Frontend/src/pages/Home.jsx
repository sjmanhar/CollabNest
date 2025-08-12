import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => (
  <div className="homepage-bg homepage-flex-wrapper">
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 w-100">
      <Card className="px-5 py-4 shadow-lg homepage-card text-center">
        <h1 className="mb-4 mt-3 gradient-text"><span className="typewriter">Welcome to CollabNest</span></h1>
        <p className="lead mb-5 mx-2">Your campus hub for events, alumni, and collaboration.</p>
        <div className="d-flex justify-content-center gap-3 mb-4">
          <Link to="/login" className="btn btn-primary home-btn">Login</Link>
          <Link to="/register" className="btn btn-outline-light home-btn">Register</Link>
        </div>
      </Card>
    </div>
  </div>
);

export default Home;
