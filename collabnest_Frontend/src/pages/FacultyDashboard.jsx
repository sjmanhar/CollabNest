import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Form, Row, Col, Spinner, Alert, Modal } from 'react-bootstrap';
// import axios from 'axios'; // Uncomment for real API

import { getEventsByFaculty } from '../service/eventService';
import { getToken } from '../service/tokenService';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function FacultyDashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    const auth = getToken();
    if (!auth || (auth.role !== 'ROLE_FACULTY' && auth.role !== 'FACULTY')) {
      navigate(auth ? '/not-authorized' : '/login', { replace: true });
    }
  }, [navigate]);
  // Event management state
  const [events, setEvents] = useState([]);
  const facultyId = localStorage.getItem('facultyId');

  useEffect(() => {
    if (!facultyId) return;
    getEventsByFaculty(facultyId)
      .then(res => setEvents(res.data))
      .catch(() => setEvents([]));
  }, [facultyId]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventForm, setEventForm] = useState({ name: '', date: '', time: '', location: '', description: '', price: 0 });

  // Event handlers
  const handleEventChange = (e) => {
    setEventForm({ ...eventForm, [e.target.name]: e.target.value });
  };
  const handleCreateEvent = (e) => {
    e.preventDefault();
    setEvents([...events, { id: Date.now(), ...eventForm }]);
    setShowEventModal(false);
    setEventForm({ name: '', date: '', time: '', location: '', description: '', price: 0 });
  };
  const handleDeleteEvent = (id) => {
    setEvents(events.filter(ev => ev.id !== id));
  };

  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('No userId found. Please log in again.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const auth = getToken();
    axios.get(`/api/faculty/by-user/${userId}`, {
      headers: { Authorization: `Bearer ${auth && auth.token ? auth.token : ''}` }
    })
      .then(res => {
        setProfile(res.data);
      })
      .catch(err => {
        setError(err.response?.data || 'Failed to fetch profile.');
        setProfile(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const userId = localStorage.getItem('userId');
    try {
      await updateFacultyProfileByUserId(userId, form);
      setProfile(form);
      setEdit(false);
      setMessage('Profile updated!');
    } catch (err) {
      setError(err.response?.data || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Container className="mt-4 text-center"><Spinner animation="border" /></Container>;
  if (error) return <Container className="mt-4"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container style={{ marginTop: 30 }}>
      <h2 className="mb-4">Faculty Dashboard</h2>
      {message && <Alert variant="success" onClose={() => setMessage(null)} dismissible>{message}</Alert>}
      <Card>
        <Card.Body>
          {edit ? (
            <Form onSubmit={handleUpdate}>
              <Row>
                <Col md={6}><Form.Group><Form.Label>Name</Form.Label><Form.Control name="name" value={form.name} onChange={handleChange} required /></Form.Group></Col>
                <Col md={6}><Form.Group><Form.Label>Email</Form.Label><Form.Control name="email" value={form.email} onChange={handleChange} required /></Form.Group></Col>
              </Row>
              <Row className="mt-2">
                <Col md={6}><Form.Group><Form.Label>Department</Form.Label><Form.Control name="department" value={form.department} onChange={handleChange} required /></Form.Group></Col>
                <Col md={6}><Form.Group><Form.Label>Designation</Form.Label><Form.Control name="designation" value={form.designation} onChange={handleChange} /></Form.Group></Col>
              </Row>
              <Button type="submit" variant="primary" className="mt-3">Save</Button>
              <Button variant="secondary" className="mt-3 ms-2" onClick={() => setEdit(false)}>Cancel</Button>
            </Form>
          ) : (
            <>
              <p><b>Name:</b> {profile.user?.name}</p>
              <p><b>Email:</b> {profile.user?.email}</p>
              <p><b>Department:</b> {profile.department}</p>
              <p><b>Designation:</b> {profile.designation}</p>
              <Button variant="outline-primary" onClick={() => setEdit(true)}>Edit Profile</Button>
            </>
          )}
        </Card.Body>
      </Card>
      <Card className="mt-4">
        <Card.Body>
          <h4>Event Management</h4>
          <Button variant="primary" className="mb-3" onClick={() => navigate('/faculty/events')}>
            Create Event
          </Button>
          <Row>
            {events.map(ev => (
              <Col md={6} lg={4} key={ev.id} className="mb-3">
                <Card>
                  <Card.Body>
                    <Card.Title>{ev.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{ev.date} at {ev.time}</Card.Subtitle>
                    <Card.Text>{ev.description}</Card.Text>
                    <div>Location: {ev.location}</div>
                    <div>Price: {ev.price === 0 ? 'Free' : `₹${ev.price}`}</div>
                    <Button variant="outline-danger" size="sm" className="mt-2" onClick={() => handleDeleteEvent(ev.id)}>
                      Delete
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
      {/* Create Event Modal */}
      <Modal show={showEventModal} onHide={() => setShowEventModal(false)}>
        <Modal.Header closeButton><Modal.Title>Create Event</Modal.Title></Modal.Header>
        <Form onSubmit={handleCreateEvent}>
          <Modal.Body>
            <Form.Group className="mb-2"><Form.Label>Name</Form.Label><Form.Control name="name" value={eventForm.name} onChange={handleEventChange} required /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Date</Form.Label><Form.Control name="date" type="date" value={eventForm.date} onChange={handleEventChange} required /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Time</Form.Label><Form.Control name="time" type="time" value={eventForm.time} onChange={handleEventChange} required /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Location</Form.Label><Form.Control name="location" value={eventForm.location} onChange={handleEventChange} required /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Description</Form.Label><Form.Control name="description" value={eventForm.description} onChange={handleEventChange} required /></Form.Group>
            <Form.Group className="mb-2"><Form.Label>Price</Form.Label><Form.Control name="price" type="number" value={eventForm.price} onChange={handleEventChange} required /></Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEventModal(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default FacultyDashboard;
