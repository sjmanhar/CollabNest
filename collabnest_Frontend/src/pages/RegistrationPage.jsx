import React, { useState } from 'react';
import { Container, Card, Button, Form, Row, Col, Alert, InputGroup } from 'react-bootstrap';
import { registerStudent, registerAlumni, registerFaculty } from '../service/authService';

const roleFields = {
  student: [
    { name: 'name', label: 'Full Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password', required: true },
    { name: 'phoneNumber', label: 'Phone Number', type: 'text', required: true },
    { name: 'prn', label: 'PRN', type: 'text', required: true },
    { name: 'branch', label: 'Branch', type: 'text', required: true },
    { name: 'location', label: 'Location', type: 'text', required: true },
  ],
  alumni: [
    { name: 'name', label: 'Full Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password', required: true },
    { name: 'phoneNumber', label: 'Phone Number', type: 'text', required: true },
    { name: 'prn', label: 'PRN', type: 'text', required: true },
    { name: 'certificateId', label: 'Certificate ID', type: 'text', required: true },
    { name: 'domain', label: 'Domain', type: 'text', required: true },
    { name: 'batchYear', label: 'Batch Year', type: 'text', required: true },
    { name: 'currentCompany', label: 'Current Company', type: 'text', required: false },
    { name: 'location', label: 'Location', type: 'text', required: true },
  ],
  faculty: [
    { name: 'name', label: 'Full Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'password', label: 'Password', type: 'password', required: true },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password', required: true },
    { name: 'phoneNumber', label: 'Phone Number', type: 'text', required: true },
    { name: 'department', label: 'Department', type: 'text', required: true },
    { name: 'location', label: 'Location', type: 'text', required: true },
  ],
};

function RegistrationPage() {
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setForm({});
    setMessage(null);
    setError(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      let res;
      if (role === 'student') {
        res = await registerStudent(form);
      } else if (role === 'alumni') {
        res = await registerAlumni(form);
      } else if (role === 'faculty') {
        res = await registerFaculty(form);
      }
      setMessage('Registration successful!');
      setForm({});
    } catch (err) {
      setError(err.response?.data || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="homepage-bg homepage-flex-wrapper">
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 w-100">
        <Container style={{ maxWidth: 500 }}>
          <Card className="px-5 py-4 shadow-lg homepage-card">
            <Card.Body>
              <h3 className="mb-4 mt-3">Register as {role.charAt(0).toUpperCase() + role.slice(1)}</h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select value={role} onChange={handleRoleChange}>
                    <option value="student">Student</option>
                    <option value="alumni">Alumni</option>
                    <option value="faculty">Faculty</option>
                  </Form.Select>
                </Form.Group>
                <Row>
                  {roleFields[role].map(field => (
                    <Col md={12} key={field.name} className="mb-3">
                      <Form.Group>
                        <Form.Label>{field.label}</Form.Label>
                        {field.name === 'password' || field.name === 'confirmPassword' ? (
                          <InputGroup>
                            <Form.Control
                              name={field.name}
                              type={
                                field.name === 'password' ? 
                                  (showPassword ? "text" : "password") : 
                                  (showConfirmPassword ? "text" : "password")
                              }
                              value={form[field.name] || ''}
                              onChange={handleChange}
                              required={field.required}
                            />
                            <Button 
                              variant="outline-secondary" 
                              onClick={() => {
                                if (field.name === 'password') {
                                  setShowPassword(!showPassword);
                                } else {
                                  setShowConfirmPassword(!showConfirmPassword);
                                }
                              }}
                              style={{ border: 'none', background: 'transparent' }}
                            >
                              {(field.name === 'password' && showPassword) || 
                               (field.name === 'confirmPassword' && showConfirmPassword) ? '🙈' : '👁️'}
                            </Button>
                          </InputGroup>
                        ) : (
                          <Form.Control
                            name={field.name}
                            type={field.type}
                            value={form[field.name] || ''}
                            onChange={handleChange}
                            required={field.required}
                          />
                        )}
                      </Form.Group>
                    </Col>
                  ))}
                </Row>
                <Button type="submit" variant="primary" disabled={loading} className="w-100 home-btn">
                  {loading ? 'Registering...' : 'Register'}
                </Button>
              </Form>
              {message && <Alert variant="success" className="mt-3">{message}</Alert>}
              {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            </Card.Body>
          </Card>
          <div style={{ textAlign: 'center', marginTop: 16 }} className="homepage-card">
            Already registered? <a href="/login">Login here</a>.
          </div>
        </Container>
      </div>
    </div>
  );
}

export default RegistrationPage;
