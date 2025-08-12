import React, { useState } from 'react';
import { Container, Card, Row, Col, Form, Button, Alert } from 'react-bootstrap';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Container className="my-5">
      <Row className="g-4">
        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Address</Card.Title>
              <Card.Text>
                CollabNest Campus<br />
                123 College Road<br />
                City, State, 123456<br />
                India
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Contact Us</Card.Title>
              {submitted ? (
                <Alert variant="success">Thank you for contacting us!</Alert>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="contactName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" value={form.name} onChange={handleChange} required />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="contactEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="contactMessage">
                    <Form.Label>Message</Form.Label>
                    <Form.Control as="textarea" name="message" rows={3} value={form.message} onChange={handleChange} required />
                  </Form.Group>
                  <Button type="submit" variant="primary" className="w-100">Send</Button>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Location</Card.Title>
              <div style={{ height: 200 }}>
                <embed
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609901742!2d72.7410999671875!3d19.0821978394395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b63d1b2b1b2d%3A0x1f1b1b1b1b1b1b1b!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1628500000000!5m2!1sen!2sin"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="CollabNest Location"
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactUs;
