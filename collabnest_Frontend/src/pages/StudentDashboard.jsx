import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
// import axios from 'axios'; // Uncomment when backend is ready

import { getStudentProfileByUserId, updateStudentProfileByUserId } from '../service/student/studentSelfService';

import { useNavigate } from 'react-router-dom';
import { getToken } from '../service/tokenService';

function StudentDashboard() {
  console.log('Rendering StudentDashboard, auth:', getToken());
  const navigate = useNavigate();
  useEffect(() => {
    const auth = getToken();
    if (!auth || (auth.role !== 'ROLE_STUDENT' && auth.role !== 'STUDENT')) {
      navigate('/not-authorized', { replace: true });
    }
  }, [navigate]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});

  // Assume userId is stored in localStorage after login
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getStudentProfileByUserId(userId)
      .then(res => {
        setProfile(res.data);
        setForm(res.data);
      })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateStudentProfileByUserId(userId, form);
      setMessage('Profile updated!');
      setProfile(form);
      setEditMode(false);
    } catch (err) {
      setMessage('Update failed.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="homepage-bg homepage-flex-wrapper">
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 w-100">
        <Container style={{ maxWidth: 600 }}>
          <h2 className="mb-4 text-white">Student Dashboard</h2>
          {message && <Alert variant="success" onClose={() => setMessage(null)} dismissible>{message}</Alert>}
          {loading ? (
            <div className="text-center"><Spinner animation="border" /></div>
          ) : profile ? (
            <Card className="px-5 py-4 shadow-lg homepage-card">
              <Card.Body>
                <Card.Title>Profile</Card.Title>
                {!editMode ? (
                  <>
                    <div><b>Name:</b> {profile.user && profile.user.name}</div>
                    <div><b>Email:</b> {profile.user && profile.user.email}</div>
                    <div><b>Branch:</b> {profile.branch}</div>
                    <div><b>Year:</b> {profile.year}</div>
                    <div><b>Resume URL:</b> {profile.resumeUrl}</div>
                    <div><b>Phone Number:</b> {profile.phoneNumber}</div>
                    <Button className="mt-3 home-btn" onClick={handleEdit}>Edit Profile</Button>
                  </>
                ) : (
                  <form onSubmit={handleUpdate}>
                    <div className="mb-2">
                      <label>Name:</label>
                      <input className="form-control" name="name" value={form.name || ''} onChange={handleChange} required />
                    </div>
                    <div className="mb-2">
                      <label>Email:</label>
                      <input className="form-control" name="email" value={form.email || ''} onChange={handleChange} required />
                    </div>
                    <div className="mb-2">
                      <label>Branch:</label>
                      <input className="form-control" name="branch" value={form.branch || ''} onChange={handleChange} />
                    </div>
                    <div className="mb-2">
                      <label>Year:</label>
                      <input className="form-control" name="year" value={form.year || ''} onChange={handleChange} />
                    </div>
                    <div className="mb-2">
                      <label>Resume URL:</label>
                      <input className="form-control" name="resumeUrl" value={form.resumeUrl || ''} onChange={handleChange} />
                    </div>
                    <div className="mb-2">
                      <label>Phone Number:</label>
                      <input className="form-control" name="phoneNumber" value={form.phoneNumber || ''} onChange={handleChange} />
                    </div>
                    <Button type="submit" className="mt-2 home-btn">Save</Button>
                    <Button variant="secondary" className="mt-2 ms-2 home-btn" onClick={() => setEditMode(false)}>Cancel</Button>
                  </form>
                )}
              </Card.Body>
            </Card>
          ) : (
            <Alert variant="danger">Profile not found.</Alert>
          )}
        </Container>
      </div>
    </div>
  );
}

export default StudentDashboard;
