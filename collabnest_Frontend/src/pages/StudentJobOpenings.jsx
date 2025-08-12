import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Button, Modal, Image, Spinner, Alert } from 'react-bootstrap';
import { getAllJobs } from '../service/jobService';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../service/tokenService';

const StudentJobOpenings = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const auth = getToken();
    if (!auth || (auth.role !== 'ROLE_STUDENT' && auth.role !== 'STUDENT')) {
      navigate('/not-authorized', { replace: true });
    }
  }, [navigate]);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setLoading(true);
    getAllJobs()
      .then(res => {
        setJobs(res.data);
        setError(null);
      })
      .catch(() => {
        setError('Failed to fetch job openings');
        setJobs([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const openModal = (job) => {
    setSelected(job);
    setShow(true);
  };
  const closeModal = () => {
    setShow(false);
    setSelected(null);
  };
  const handleApply = () => {
    if (selected && selected.applyUrl) {
      window.open(selected.applyUrl, '_blank');
    }
  };

  if (loading) return <Container className="my-5 text-center"><Spinner animation="border" /></Container>;
  if (error) return <Container className="my-5"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <div className="homepage-bg homepage-flex-wrapper">
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 w-100">
        <Container className="my-5" style={{ maxWidth: 800 }}>
          <h3 className="text-white mb-4">Job Openings</h3>
          <Row className="justify-content-center">
            <Col md={8}>
              {jobs.map(job => (
                <Card key={job.id} className="mb-4" onClick={() => openModal(job)} style={{ cursor: 'pointer' }}>
                  <Card.Body className="d-flex align-items-center">
                    <Image src={job.logo} height={48} width={48} alt="logo" className="me-3 bg-white p-1 rounded" />
                    <div>
                      <Card.Title>{job.title || job.company}</Card.Title>
                      <Card.Subtitle className="mb-1 text-muted">{job.company}{job.company && job.location ? ' | ' : ''}{job.location}</Card.Subtitle>
                      <Card.Text className="mb-0"><b>Salary:</b> {job.salary ? `₹${job.salary}` : 'N/A'}</Card.Text>
                      <Card.Text className="mb-0"><b>Eligibility:</b> {job.eligibility || 'N/A'}</Card.Text>
                      <Card.Text className="mb-0"><b>Posted:</b> {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}</Card.Text>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </Col>
          </Row>
          <Modal show={show} onHide={closeModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>{selected && (selected.title || selected.company)}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selected && (
                <>
                  <Image src={selected.logo} height={48} width={48} alt="logo" className="mb-3 bg-white p-1 rounded" />
                  <div><b>Company:</b> {selected.company}</div>
<div><b>Location:</b> {selected.location}</div>
<div><b>Salary:</b> {selected.salary ? `₹${selected.salary}` : 'N/A'}</div>
<div><b>Eligibility:</b> {selected.eligibility || 'N/A'}</div>
<div><b>Posted:</b> {selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : 'N/A'}</div>
<p className="mt-2">{selected.description}</p>
<Button variant="primary" className="home-btn w-100" onClick={handleApply}>Apply (Go to Company Site)</Button>
                </>
              )}
            </Modal.Body>
          </Modal>
        </Container>
      </div>
    </div>
  );
};

export default StudentJobOpenings;
