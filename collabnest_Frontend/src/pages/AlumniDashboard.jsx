import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Form, Row, Col, Spinner, Alert, Modal } from 'react-bootstrap';
// import axios from 'axios'; // Uncomment for real API

import { getAlumniProfileByUserId, updateAlumniProfileByUserId } from '../service/alumni/alumniSelfService';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../service/tokenService';

function AlumniDashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    const auth = getToken();
    if (!auth || (auth.role !== 'ROLE_ALUMNI' && auth.role !== 'ALUMNI')) {
      navigate(auth ? '/not-authorized' : '/login', { replace: true });
    }
  }, [navigate]);
  // Referral system state
  const [referrals, setReferrals] = useState([
    { id: 1, title: 'Referral for TechCorp', description: 'Referred for Software Engineer role.' },
    { id: 2, title: 'Referral for DataInc', description: 'Referred for Data Analyst.' }
  ]);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [referralForm, setReferralForm] = useState({ title: '', description: '' });
  const [editingReferral, setEditingReferral] = useState(null);

  // Referral handlers
  const handleReferralChange = (e) => {
    setReferralForm({ ...referralForm, [e.target.name]: e.target.value });
  };
  const handleReferralSubmit = (e) => {
    e.preventDefault();
    if (editingReferral) {
      setReferrals(referrals.map(r => r.id === editingReferral.id ? { ...editingReferral, ...referralForm } : r));
    } else {
      setReferrals([...referrals, { id: Date.now(), ...referralForm }]);
    }
    setShowReferralModal(false);
    setEditingReferral(null);
    setReferralForm({ title: '', description: '' });
  };
  const handleEditReferral = (ref) => {
    setEditingReferral(ref);
    setReferralForm({ title: ref.title, description: ref.description });
    setShowReferralModal(true);
  };
  const handleDeleteReferral = (id) => {
    setReferrals(referrals.filter(r => r.id !== id));
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
    getAlumniProfileByUserId(userId)
      .then(res => {
        setProfile(res.data);
        if (res.data && res.data.alumniId) {
          localStorage.setItem('alumniId', res.data.alumniId);
        }
        setForm(res.data);
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
      await updateAlumniProfileByUserId(userId, form);
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
    <div className="alumni-bg homepage-flex-wrapper">
      <Container style={{ marginTop: 30 }}>
        <h2 className="mb-4 text-white">Alumni Dashboard</h2>
        {message && <Alert variant="success" onClose={() => setMessage(null)} dismissible>{message}</Alert>}
        <Card className="alumni-card">
          <Card.Body>
            {edit ? (
              <Form onSubmit={handleUpdate}>
                <Row>
                  <Col md={6}><Form.Group><Form.Label>Name</Form.Label><Form.Control name="name" value={form.name} onChange={handleChange} required /></Form.Group></Col>
                  <Col md={6}><Form.Group><Form.Label>Email</Form.Label><Form.Control name="email" value={form.email} onChange={handleChange} required /></Form.Group></Col>
                </Row>
                <Row className="mt-2">
                  <Col md={4}><Form.Group><Form.Label>Batch</Form.Label><Form.Control name="batch" value={form.batch} onChange={handleChange} required /></Form.Group></Col>
                  <Col md={4}><Form.Group><Form.Label>Company</Form.Label><Form.Control name="company" value={form.company} onChange={handleChange} /></Form.Group></Col>
                  <Col md={4}><Form.Group><Form.Label>Designation</Form.Label><Form.Control name="designation" value={form.designation} onChange={handleChange} /></Form.Group></Col>
                </Row>
                <Button type="submit" className="alumni-btn mt-3">Save</Button>
                <Button variant="secondary" className="mt-3 ms-2" onClick={() => setEdit(false)}>Cancel</Button>
              </Form>
            ) : (
              <>
                <p><b>Name:</b> {profile.name}</p>
                <p><b>Email:</b> {profile.email}</p>
                <p><b>Batch:</b> {profile.batch}</p>
                <p><b>Company:</b> {profile.company}</p>
                <p><b>Designation:</b> {profile.designation}</p>
                <Button className="alumni-btn" onClick={() => setEdit(true)}>Edit Profile</Button>
              </>
            )}
          </Card.Body>
        </Card>
        <Card className="mt-4 alumni-card">
          <Card.Body>
            <h4 className="text-dark">Referrals</h4>
            <Button className="alumni-btn mb-3" onClick={() => setShowReferralModal(true)}>
              Create Referral
            </Button>
            <Row>
              {referrals.map(ref => (
                <Col md={6} key={ref.id} className="mb-3">
                  <Card>
                    <Card.Body>
                      <Card.Title>{ref.title}</Card.Title>
                      <Card.Text>{ref.description}</Card.Text>
                      <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleEditReferral(ref)}>
                        Edit
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteReferral(ref.id)}>
                        Delete
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
        {/* Create/Edit Referral Modal */}
        <Modal show={showReferralModal} onHide={() => { setShowReferralModal(false); setEditingReferral(null); }}>
          <Modal.Header closeButton><Modal.Title>{editingReferral ? 'Edit' : 'Create'} Referral</Modal.Title></Modal.Header>
          <Form onSubmit={handleReferralSubmit}>
            <Modal.Body>
              <Form.Group className="mb-2"><Form.Label>Title</Form.Label><Form.Control name="title" value={referralForm.title} onChange={handleReferralChange} required /></Form.Group>
              <Form.Group className="mb-2"><Form.Label>Description</Form.Label><Form.Control name="description" value={referralForm.description} onChange={handleReferralChange} required /></Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => { setShowReferralModal(false); setEditingReferral(null); }}>Cancel</Button>
              <Button type="submit" className="alumni-btn">{editingReferral ? 'Update' : 'Create'}</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </div>
  );
}

export default AlumniDashboard;
