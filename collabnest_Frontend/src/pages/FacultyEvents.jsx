import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Form, Button, Modal, Alert, Image, Spinner } from 'react-bootstrap';
import { getEventsByFaculty, createEvent, updateEvent, deleteEvent } from '../service/eventService';

import { useNavigate } from 'react-router-dom';
import { getToken } from '../service/tokenService';

const FacultyEvents = () => {
  const navigate = useNavigate();
  // Listen for global event to open modal (from navbar)
  React.useEffect(() => {
    const handler = () => handleShow(null);
    window.addEventListener('openFacultyEventModal', handler);
    return () => window.removeEventListener('openFacultyEventModal', handler);
  }, []);
  // Open modal if ?create=1 is present
  React.useEffect(() => {
    if (window.location.search.includes('create=1')) {
      handleShow(null);
      // Remove the query param from the URL after opening modal
      navigate('/faculty/events', { replace: true });
    }
  }, [navigate]);
  useEffect(() => {
    const auth = getToken();
    if (!auth || (auth.role !== 'ROLE_FACULTY' && auth.role !== 'FACULTY')) {
      navigate('/not-authorized', { replace: true });
    }
  }, [navigate]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    poster: '',
    datetime: '',
    location: '',
    description: '',
    price: '',
    audience: 'student',
  });
  const [alert, setAlert] = useState(null);
  const facultyId = localStorage.getItem('facultyId');

  useEffect(() => {
    if (!facultyId) {
      setError('No facultyId found. Please log in again.');
      setLoading(false);
      return;
    }
    setLoading(true);
    getEventsByFaculty(facultyId)
      .then(res => {
        setEvents(res.data);
        setError(null);
      })
      .catch(() => {
        setError('Failed to fetch events.');
        setEvents([]);
      })
      .finally(() => setLoading(false));
  }, [facultyId]);

  const handleShow = (event) => {
    if (event) {
      setForm(event);
      setEditId(event.id);
    } else {
      setForm({ name: '', poster: '', datetime: '', location: '', description: '', price: '', audience: 'student' });
      setEditId(null);
    }
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setAlert(null);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'poster' && files && files[0]) {
      setForm({ ...form, poster: URL.createObjectURL(files[0]) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  handleSave();
};

const handleSave = async () => {
    if (!facultyId) return;
    setLoading(true);
    try {
      if (editId) {
        await updateEvent(editId, facultyId, form);
        setAlert('Event updated!');
      } else {
        await createEvent(facultyId, form);
        setAlert('Event added!');
      }
      // Refresh events list
      const res = await getEventsByFaculty(facultyId);
      setEvents(res.data);
      setShowModal(false);
    } catch {
      setAlert('Failed to save event.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!facultyId) return;
    setLoading(true);
    try {
      await deleteEvent(id, facultyId);
      setAlert('Event deleted!');
      const res = await getEventsByFaculty(facultyId);
      setEvents(res.data);
    } catch {
      setAlert('Failed to delete event.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Container className="my-5 text-center"><Spinner animation="border" /></Container>;
  if (error) return <Container className="my-5"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Events Created by You</h3>
        <Button variant="primary" onClick={() => handleShow(null)}>Create Event</Button>
      </div>
      {alert && <Alert variant="info">{alert}</Alert>}
      <Row>
        {events.map(ev => (
          <Col md={6} key={ev.id} className="mb-4">
            <Card>
              {ev.poster && <Image src={ev.poster} height={180} alt="poster" className="w-100" style={{ objectFit: 'cover' }} />}
              <Card.Body>
                <Card.Title>{ev.name}</Card.Title>
                <div><b>Date & Time:</b> {ev.datetime ? ev.datetime.replace('T', ' ') : 'N/A'}</div>
                <div><b>Location:</b> {ev.location}</div>
                <div><b>Price:</b> {ev.price === 0 ? 'Free' : `₹${ev.price}`}</div>
                <div><b>For:</b> {ev.audience}</div>
                <p className="mt-2">{ev.description}</p>
                <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleShow(ev)}>
                  Edit
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(ev.id)}>
                  Delete
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {/* Create/Edit Event Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Edit Event' : 'Create Event'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-2">
              <Form.Label>Event Name</Form.Label>
              <Form.Control name="name" value={form.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Poster</Form.Label>
              <Form.Control type="file" name="poster" accept="image/*" onChange={handleChange} />
              {form.poster && <Image src={form.poster} height={80} className="mt-2" alt="poster preview" />}
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Date and Time</Form.Label>
              <Form.Control type="datetime-local" name="datetime" value={form.datetime} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Location</Form.Label>
              <Form.Control name="location" value={form.location} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" rows={2} value={form.description} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Price (₹)</Form.Label>
              <Form.Control type="number" name="price" value={form.price} onChange={handleChange} min={0} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Who is this event for?</Form.Label>
              <Form.Select name="audience" value={form.audience} onChange={handleChange} required>
                <option value="student">Student</option>
                <option value="alumni">Alumni</option>
                <option value="open">Open for All</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            <Button variant="primary" type="submit">{editId ? 'Update' : 'Create'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default FacultyEvents;
