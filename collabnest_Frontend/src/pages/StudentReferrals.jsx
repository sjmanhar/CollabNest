import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../service/tokenService';
import { Card, Container, Row, Col, Button, Badge, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { applyForReferralApplication } from '../service/referralService';

// Remove dummyReferrals; use backend data

const statusVariant = {
  'Not Applied': 'secondary',
  'Pending': 'warning',
  'Rejected': 'danger',
  'Approved': 'success',
};

const StudentReferrals = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const auth = getToken();
    if (!auth || (auth.role !== 'ROLE_STUDENT' && auth.role !== 'STUDENT')) {
      navigate('/not-authorized', { replace: true });
    }
  }, [navigate]);

  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [applyMsg, setApplyMsg] = useState(null);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyReason, setApplyReason] = useState('');
  const studentId = localStorage.getItem('studentId') || localStorage.getItem('userId');

  useEffect(() => {
    const fetchActiveReferrals = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('/api/referrals/active', {
          headers: { Authorization: `Bearer ${getToken()?.token || ''}` }
        });
        setReferrals(res.data);
      } catch (err) {
        if (err.response && err.response.status === 403) {
          setError('You are not authorized to view referrals. Please log in as a student.');
        } else {
          setError('Failed to load referrals.');
        }
      }
      setLoading(false);
    };
    fetchActiveReferrals();
  }, []);

  const handleShow = (ref) => {
    setSelected(ref);
    setShowModal(true);
    setApplyMsg(null);
  };
  const handleClose = () => {
    setShowModal(false);
    setSelected(null);
    setApplyMsg(null);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!studentId) {
      setApplyMsg('Error: No studentId found. Please log in again.');
      return;
    }
    if (!selected || !selected.referralId) {
      setApplyMsg('Error: No referral selected.');
      return;
    }
    setApplyLoading(true);
    try {
      console.log('Applying with:', { referralId: selected.referralId, studentId, reason: applyReason });
      await applyForReferralApplication(selected.referralId, studentId /*, applyReason*/);
      setApplyMsg('Application submitted!');
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 409:
            setApplyMsg('You have already applied for this referral.');
            break;
          case 404:
            setApplyMsg('Referral or student not found. Please refresh and try again.');
            break;
          case 403:
            setApplyMsg('You are not authorized to apply for this referral.');
            break;
          case 400:
            setApplyMsg('Invalid request. Please check your details and try again.');
            break;
          default:
            setApplyMsg('Failed to apply.');
        }
      } else {
        setApplyMsg('Failed to apply.');
      }
      console.error('Apply error:', err);
    } finally {
      setApplyLoading(false);
    }
  };

  return (
    <div className="homepage-bg homepage-flex-wrapper">
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 w-100">
        <Container className="my-5" style={{ maxWidth: 900 }}>
          <h3 className="text-white mb-4">Referrals</h3>
          {loading ? (
            <div className="text-center my-5"><Spinner animation="border" /></div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <>
              <Row>
                {referrals.map(ref => {
      // Assume ref.isApproved or ref.status === 'APPROVED' means expired
      const isExpired = ref.isApproved || ref.status === 'APPROVED';
      return (
        <Col md={6} key={ref.referralId} className="mb-4">
          <Card
            onClick={isExpired ? undefined : () => handleShow(ref)}
            style={{ cursor: isExpired ? 'not-allowed' : 'pointer', opacity: isExpired ? 0.7 : 1 }}
          >
            <Card.Body>
              <Row>
                <Col xs={3}>
                  {/* Optionally use alumni image if present */}
                  {ref.alumni?.image ? (
                    <img src={ref.alumni.image} alt="alumni" className="img-fluid rounded-circle" />
                  ) : (
                    <div className="img-placeholder rounded-circle" style={{width: 64, height: 64, background: '#ccc'}} />
                  )}
                </Col>
                <Col>
                  <Card.Title>
                    {ref.alumni?.name || 'Alumni'}{' '}
                    {isExpired && <Badge bg="danger" className="ms-2">Expired</Badge>}
                  </Card.Title>
                  <Card.Subtitle className="mb-1 text-muted">{ref.alumni?.role || ''}</Card.Subtitle>
                  <Card.Text>
                    <b>Expertise:</b> {ref.alumni?.expertise || ''}<br/>
                    <b>Location:</b> {ref.alumni?.location || ''}<br/>
                    <b>Company:</b> {ref.alumni?.company || ''}<br/>
                  </Card.Text>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      );
    })}
              </Row>
              <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                  <Modal.Title>Referral Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {selected && (
                    <>
                      <Row className="mb-3">
                        <Col xs={3}>
                          <img src={selected.alumni?.image || 'https://via.placeholder.com/64'} alt="alumni" className="img-fluid rounded-circle" />
                        </Col>
                        <Col>
                          <h5>{selected.alumni?.name || 'Alumni'}</h5>
                          <div>{selected.alumni?.role || ''}</div>
                          <div><b>Expertise:</b> {selected.alumni?.expertise || ''}</div>
                          <div><b>Location:</b> {selected.alumni?.location || ''}</div>
                          <div><b>Company:</b> {selected.alumni?.company || ''}</div>
                        </Col>
                      </Row>
                      <p>{selected.description}</p>
                      <Form onSubmit={handleApply}>
                        <Form.Group className="mb-3">
                          <Form.Label>Why are you a good fit?</Form.Label>
                          <Form.Control as="textarea" rows={3} value={applyReason} onChange={e => setApplyReason(e.target.value)} disabled={applyLoading} />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="home-btn w-100" disabled={applyLoading}>
                          {applyLoading ? 'Applying...' : 'Apply'}
                        </Button>
                        {applyMsg && <Alert className="mt-2" variant={applyMsg.includes('success') ? 'success' : 'info'}>{applyMsg}</Alert>}
                      </Form>
                    </>
                  )}
                </Modal.Body>
              </Modal>
            </>
          )}
        </Container>
      </div>
    </div>
  );
};

export default StudentReferrals;
