import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Modal, Table, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../service/tokenService';
import { getReferralsByAlumni, getApplicantsByReferral, approveReferralApplicant } from '../service/referralService';

const AlumniApplications = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const auth = getToken();
    if (!auth || (auth.role !== 'ROLE_ALUMNI' && auth.role !== 'ALUMNI')) {
      navigate('/not-authorized', { replace: true });
    }
  }, [navigate]);

  const [referrals, setReferrals] = useState([]);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReferrals = async () => {
      setLoading(true);
      try {
        const auth = getToken();
        if (!auth) return;
        const res = await getReferralsByAlumni(auth.alumniId || auth.id);
        setReferrals(res.data);
        setError(null);
      } catch {
        setError('Failed to fetch referrals.');
      } finally {
        setLoading(false);
      }
    };
    fetchReferrals();
  }, []);

  const handleShowApplications = async (referral) => {
    setSelectedReferral(referral);
    setShowModal(true);
    setAlert(null);
    setLoading(true);
    try {
      const res = await getApplicantsByReferral(referral.id || referral.referralId);
      setApplicants(res.data);
      setError(null);
    } catch {
      setError('Failed to fetch applicants.');
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedReferral(null);
    setApplicants([]);
    setAlert(null);
  };

  const handleApprove = async (applicationId) => {
    setLoading(true);
    try {
      await approveReferralApplicant(applicationId);
      setAlert('Applicant approved and others rejected!');
      // Refresh applicants
      if (selectedReferral) {
        const res = await getApplicantsByReferral(selectedReferral.id || selectedReferral.referralId);
        setApplicants(res.data);
      }
    } catch {
      setAlert('Failed to approve applicant.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Container className="my-5 text-center"><span>Loading...</span></Container>;
  if (error) return <Container className="my-5"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <div className="alumni-bg homepage-flex-wrapper">
      <Container className="my-5">
        <h3 className="text-white">Your Referrals - Applications</h3>
        <Row>
          {referrals.map(ref => (
            <Col md={6} key={ref.id || ref.referralId} className="mb-4">
              <Card className="alumni-card">
                <Card.Body>
                  <Card.Title className="text-dark">{ref.company} - {ref.position}</Card.Title>
                  <Button className="alumni-btn" onClick={() => handleShowApplications(ref)}>
                    View Applications
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <Modal show={showModal} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Applications for {selectedReferral?.company} - {selectedReferral?.position}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {alert && <Alert variant="info">{alert}</Alert>}
            <Table bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {applicants && applicants.length > 0 ? (
                  applicants.map(app => (
                    <tr key={app.applicationId}>
                      <td>{app.name}</td>
                      <td>{app.email}</td>
                      <td>
                        {app.status === 'APPROVED' && <span style={{ color: 'green' }}>Approved</span>}
                        {app.status === 'REJECTED' && <span style={{ color: 'red' }}>Rejected</span>}
                        {app.status === 'PENDING' && <span>Pending</span>}
                      </td>
                      <td>
                        {app.status === 'PENDING' && (
                          <Button size="sm" variant="success" onClick={() => handleApprove(app.applicationId)}>
                            Approve
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" className="text-center">No applicants found.</td></tr>
                )}
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default AlumniApplications;
