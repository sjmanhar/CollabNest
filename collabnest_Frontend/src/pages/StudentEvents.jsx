import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Button, Modal, Badge, Image, Alert, Spinner } from 'react-bootstrap';
import { getAllEvents, registerForEvent } from '../service/eventService';
import { createOrder, verifyPayment } from '../service/paymentService';

import { useNavigate } from 'react-router-dom';
import { getToken, getJwt } from '../service/tokenService';

const StudentEvents = () => {
  // Razorpay script loader state
  const [razorpayLoaded, setRazorpayLoaded] = useState(!!window.Razorpay);

  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => setRazorpayLoaded(true);
      script.onerror = () => setRazorpayLoaded(false);
      document.body.appendChild(script);
    } else {
      setRazorpayLoaded(true);
    }
  }, []);

  const navigate = useNavigate();
  useEffect(() => {
    const auth = getToken();
    if (!auth || (auth.role !== 'ROLE_STUDENT' && auth.role !== 'STUDENT')) {
      navigate('/not-authorized', { replace: true });
    }
  }, [navigate]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState(null);
  const [paid, setPaid] = useState(false);
  const [attended, setAttended] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    setLoading(true);
    getAllEvents()
      .then(res => {
        setEvents(res.data);
        setError(null);
      })
      .catch(err => {
        setError('Failed to fetch events');
        setEvents([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const openModal = (event) => {
    setSelected(event);
    setPaid(event.price === 0);
    setAttended(event.attended);
    setShow(true);
    setAlert(null);
  };

  const closeModal = () => {
    setShow(false);
    setSelected(null);
    setAlert(null);
  };


  const handlePayment = async (event) => {
    event?.preventDefault && event.preventDefault();
    if (!selected) {
      setAlert('No event selected!');
      return;
    }
    if (!razorpayLoaded) {
      setAlert('Payment system is still loading. Please wait and try again.');
      return;
    }
    const token = getJwt();
    try {
      setLoading(true);
      // Step 1: Create Razorpay order from backend
      const orderRes = await fetch(
        `http://localhost:8080/api/payments/create-order`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: selected.price,
            eventId: selected.id,
            userId: getToken()?.userId, // Try userId field, else check token log
          }),
        }
      );
      if (!orderRes.ok) {
        throw new Error('Failed to create payment order');
      }
      const orderData = await orderRes.json();
      // Step 2: Razorpay options
      console.log('window.Razorpay:', window.Razorpay);
      console.log('Order Data:', orderData);
      if (!window.Razorpay) {
        setAlert('Payment system not loaded. Please refresh and try again.');
        setLoading(false);
        return;
      }
      const options = {
        key: orderData.key || 'rzp_test_TNpcedZQbcsMrm',
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: selected.name,
        description: selected.description,
        order_id: orderData.id || orderData.orderId,
        handler: async function (response) {
          // Step 3: Verify payment
          const verifyRes = await fetch(
            'http://localhost:8080/api/payments/verify',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            }
          );
          if (verifyRes.ok) {
            setPaid(true);
            setAlert('Payment successful! You can now mark attendance.');
          } else {
            setAlert('Payment verification failed!');
          }
          setLoading(false);
        },
        prefill: {
          name: getToken()?.name || 'Student',
          email: getToken()?.email || '',
        },
        theme: {
          color: '#3399cc',
        },
      };
      console.log('Razorpay options:', options);
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error:', error);
      setAlert('Something went wrong.');
      setLoading(false);
    }
  };


  const handleAttendance = async () => {
    if (!selected) return;
    try {
      await registerForEvent(selected.id);
      setAttended(true);
      setAlert('Attendance marked successfully!');
    } catch (err) {
      setAlert('Failed to mark attendance.');
    }
  };

  if (loading) return <Container className="my-5 text-center"><Spinner animation="border" /></Container>;
  if (error) return <Container className="my-5"><Alert variant="danger">{error}</Alert></Container>;

  return (
    <div className="homepage-bg homepage-flex-wrapper">
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 w-100">
        <Container className="my-5" style={{ maxWidth: 800 }}>
          <h3 className="text-white mb-4">Events</h3>
          <Row className="justify-content-center">
            <Col md={8}>
              {events.map(event => (
                <Card key={event.id} className="mb-4" onClick={() => openModal(event)} style={{ cursor: 'pointer' }}>
                  <Row>
                    <Col md={4}>
                      {event.poster ? (
  <Image src={event.poster} alt={event.name} fluid rounded />
) : null}
                    </Col>
                    <Col md={8}>
                      <Card.Body>
                        <Card.Title>{event.name}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                          {event.dateTime ? new Date(event.dateTime).toLocaleString() : ''}
                        </Card.Subtitle>
                        <Card.Text>{event.description}</Card.Text>
                        <div>Location: {event.location}</div>
                        <div>Price: {event.price === 0 ? 'Free' : `₹${event.price}`}</div>
                        <Badge bg="info" className="mt-2">Audience: {event.audience}</Badge>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              ))}
            </Col>
          </Row>
          <Modal show={show} onHide={closeModal}>
            <Modal.Header closeButton>
              <Modal.Title>{selected?.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {alert && <Alert variant="success">{alert}</Alert>}
              {selected?.poster ? (
  <Image src={selected.poster} alt={selected?.name} fluid rounded className="mb-3" />
) : null}
              <div><b>Date/Time:</b> {selected?.dateTime ? new Date(selected.dateTime).toLocaleString() : ''}</div>
              <div><b>Description:</b> {selected?.description}</div>
              <div><b>Location:</b> {selected?.location}</div>
              <div><b>Price:</b> {selected?.price === 0 ? 'Free' : `₹${selected?.price}`}</div>
              <div><b>Audience:</b> {selected?.audience}</div>
            </Modal.Body>
            <Modal.Footer>
              {!paid && (
                <Button variant="primary" className="home-btn" onClick={handlePayment}>Pay & Register</Button>
              )}
              {paid && !attended && (
                <Button variant="success" className="home-btn" onClick={handleAttendance}>Mark Attendance</Button>
              )}
              {attended && <Badge bg="success">Attended</Badge>}
              <Button variant="secondary" className="home-btn" onClick={closeModal}>Close</Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    </div>
  );
};

export default StudentEvents;
