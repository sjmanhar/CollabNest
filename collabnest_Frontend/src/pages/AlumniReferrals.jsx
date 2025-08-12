import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Form, Button, Modal, Alert, Spinner } from 'react-bootstrap';
import { getReferralsByAlumni, createReferral, updateReferral, deleteReferral } from '../service/referralService';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../service/tokenService';

const AlumniReferrals = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const auth = getToken();
    if (!auth || (auth.role !== 'ROLE_ALUMNI' && auth.role !== 'ALUMNI')) {
      navigate('/not-authorized', { replace: true });
    }
  }, [navigate]);

  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    company: '',
    position: '',
    location: '',
    description: '',
    postedOn: '',
  });
  const [alert, setAlert] = useState(null);
  const alumniId = localStorage.getItem('alumniId');

  useEffect(() => {
    if (!alumniId) {
      setError('No alumniId found. Please log in again.');
      setLoading(false);
      return;
    }
    setLoading(true);
    getReferralsByAlumni(alumniId)
      .then(res => {
        setReferrals(res.data);
        setError(null);
      })
      .catch(() => {
        setError('Failed to fetch referrals.');
        setReferrals([]);
      })
      .finally(() => setLoading(false));
  }, [alumniId]);

  const handleShow = (referral) => {
    if (referral) {
      setForm(referral);
      setEditId(referral.id);
    } else {
      setForm({ company: '', position: '', location: '', description: '', postedOn: '' });
      setEditId(null);
    }
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setAlert(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSave = async () => {
    if (!alumniId) return;
    setLoading(true);
    try {
      if (editId) {
        await updateReferral(editId, alumniId, form);
        setAlert('Referral updated!');
      } else {
        await createReferral(alumniId, form);
        setAlert('Referral added!');
      }
      // Refresh referral list
      const res = await getReferralsByAlumni(alumniId);
      setReferrals(res.data);
      setShowModal(false);
    } catch {
      setAlert('Failed to save referral.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!alumniId) return;
    setLoading(true);
    try {
      await deleteReferral(id, alumniId);
      setAlert('Referral deleted!');
      const res = await getReferralsByAlumni(alumniId);
      setReferrals(res.data);
    } catch {
      setAlert('Failed to delete referral.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Container className="my-5 text-center"><Spinner animation="border" /></Container>;
  if (error) return <Container className="my-5"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <div className="alumni-bg homepage-flex-wrapper">
      <Container className="my-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="text-white">Referrals Created by You</h3>
          <Button className="alumni-btn" onClick={() => handleShow(null)}>Create Referral</Button>
        </div>
        {alert && <Alert variant="info">{alert}</Alert>}
        <Row>
          {referrals.map(r => (
            <Col md={6} key={r.id} className="mb-4">
              <Card className="alumni-card">
                <Card.Body>
                  <Card.Title className="text-dark">{r.company} - {r.position}</Card.Title>
                  <div><b>Location:</b> {r.location}</div>
                  <div><b>Posted On:</b> {r.postedOn}</div>
                  <p className="mt-2">{r.description}</p>
                  <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleShow(r)}>
                    Edit
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(r.id)}>
                    Delete
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        {/* Create/Edit Referral Modal */}
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{editId ? 'Edit Referral' : 'Create Referral'}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSave}>
            <Modal.Body>
              <Form.Group className="mb-2">
                <Form.Label>Company</Form.Label>
                <Form.Control name="company" value={form.company} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Position</Form.Label>
                <Form.Control name="position" value={form.position} onChange={handleChange} required />
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
                <Form.Label>Posted On</Form.Label>
                <Form.Control type="date" name="postedOn" value={form.postedOn} onChange={handleChange} required />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>Cancel</Button>
              <Button className="alumni-btn" type="submit">{editId ? 'Update' : 'Create'}</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </div>
  );
};

export default AlumniReferrals;
