import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Form, Button, Modal, Alert, Spinner } from 'react-bootstrap';
import { getJobsByAlumni, createJobByAlumni, updateJobByAlumni, deleteJobByAlumni } from '../service/jobService';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../service/tokenService';

const AlumniJobs = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const auth = getToken();
    if (!auth || (auth.role !== 'ROLE_ALUMNI' && auth.role !== 'ALUMNI')) {
      navigate('/not-authorized', { replace: true });
    }
  }, [navigate]);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    salary: '',
    postedOn: '',
    eligibility: '',
  });
  const [alert, setAlert] = useState(null);
  const [alumniId, setAlumniId] = useState(localStorage.getItem('alumniId'));

  useEffect(() => {
    async function ensureAlumniId() {
      let id = localStorage.getItem('alumniId');
      if (!id) {
        const userId = localStorage.getItem('userId');
        if (userId) {
          try {
            const res = await import('../service/alumni/alumniSelfService').then(m => m.getAlumniProfileByUserId(userId));
            if (res.data && res.data.alumniId) {
              id = res.data.alumniId;
              localStorage.setItem('alumniId', id);
              setAlumniId(id);
            }
          } catch {
            setError('No alumniId found. Please log in again.');
            setLoading(false);
            return;
          }
        } else {
          setError('No alumniId found. Please log in again.');
          setLoading(false);
          return;
        }
      } else {
        setAlumniId(id);
      }
      setLoading(true);
      getJobsByAlumni(id)
        .then(res => {
          setJobs(res.data);
          setError(null);
        })
        .catch(() => {
          setError('Failed to fetch jobs.');
          setJobs([]);
        })
        .finally(() => setLoading(false));
    }
    ensureAlumniId();
  }, []);

  const handleShow = (job) => {
    if (job) {
      setForm(job);
      setEditId(job.id);
    } else {
      setForm({ title: '', company: '', location: '', description: '', salary: '', postedOn: '', eligibility: '' });
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
        await updateJobByAlumni(editId, alumniId, form);
        setAlert('Job updated!');
      } else {
        await createJobByAlumni(alumniId, form);
        setAlert('Job added!');
      }
      // Refresh job list
      const res = await getJobsByAlumni(alumniId);
      setJobs(res.data);
      setShowModal(false);
    } catch {
      setAlert('Failed to save job.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!alumniId) return;
    setLoading(true);
    try {
      await deleteJobByAlumni(id, alumniId);
      setAlert('Job deleted!');
      const res = await getJobsByAlumni(alumniId);
      setJobs(res.data);
    } catch {
      setAlert('Failed to delete job.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave();
  };

  if (loading) return <Container className="my-5 text-center"><Spinner animation="border" /></Container>;
  if (error) return <Container className="my-5"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <div className="alumni-bg homepage-flex-wrapper">
      <Container className="my-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="text-white">Job Openings Created by You</h3>
          <Button className="alumni-btn" onClick={() => handleShow(null)}>Create Job Opening</Button>
        </div>
        {alert && <Alert variant="info">{alert}</Alert>}
        <Row>
          {jobs.map(j => (
            <Col md={6} key={j.id} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{j.title}</Card.Title>
                  <div><b>Company:</b> {j.company}</div>
                  <div><b>Location:</b> {j.location}</div>
                  <div><b>Salary:</b> {j.salary}</div>
                  <div><b>Eligibility:</b> {j.eligibility}</div>
                  <div><b>Posted On:</b> {j.postedOn}</div>
                  <p className="mt-2">{j.description}</p>
                  <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleShow(j)}>
                    Edit
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(j.id)}>
                    Delete
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        {/* Create/Edit Job Modal */}
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{editId ? 'Edit Job Opening' : 'Create Job Opening'}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>

            <Modal.Body>
              <Form.Group className="mb-2">
                <Form.Label>Job Title</Form.Label>
                <Form.Control name="title" value={form.title} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Company</Form.Label>
                <Form.Control name="company" value={form.company} onChange={handleChange} required />
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
                <Form.Label>Salary</Form.Label>
                <Form.Control name="salary" value={form.salary} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Eligibility</Form.Label>
                <Form.Control name="eligibility" value={form.eligibility} onChange={handleChange} required />
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

export default AlumniJobs;
