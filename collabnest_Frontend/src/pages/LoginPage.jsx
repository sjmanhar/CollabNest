import React, { useState } from 'react';
import { Container, Card, Button, Form, Row, Col, Alert, InputGroup, FormControl } from 'react-bootstrap';
import { login } from '../service/authService';

const roles = [
  { value: 'student', label: 'Student' },
  { value: 'alumni', label: 'Alumni' },
  { value: 'faculty', label: 'Faculty' },
  { value: 'admin', label: 'Admin' },
];

import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleRoleChange = (e) => {
    setRole(e.target.value);
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
      // AuthController expects /api/auth/login with email and password
      const res = await login({ ...form });
      setMessage('Login successful!');
      // Store both JWT and role together in localStorage
      import('../service/tokenService').then(({ storeToken }) => {
        storeToken(res.data.token, res.data.role);
        localStorage.setItem('userId', res.data.userId);
        console.log('Login response:', res.data);
        // Role-based redirect using React Router
        let path = '/';
        switch (res.data.role) {
          case 'ROLE_ADMIN':
          case 'ADMIN':
            path = '/admin/dashboard';
            break;
          case 'ROLE_FACULTY':
          case 'FACULTY':
            localStorage.setItem('facultyId', res.data.userId);
            path = '/faculty/dashboard';
            break;
          case 'ROLE_ALUMNI':
          case 'ALUMNI':
            path = '/alumni/dashboard';
            break;
          case 'ROLE_STUDENT':
          case 'STUDENT':
            path = '/student/dashboard';
            break;
          default:
            path = '/';
        }
        navigate(path, { replace: true });
      });
    } catch (err) {
      setError(err.response?.data || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="homepage-bg homepage-flex-wrapper">
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 w-100">
        <Container style={{ maxWidth: 430 }}>
          <Card className="px-5 py-4 shadow-lg homepage-card">
            <Card.Body>
              <h3 className="mb-4 mt-3">Login</h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select value={role} onChange={handleRoleChange}>
                    {roles.map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12} className="mb-4">
                    <Form.Group>
                      <Form.Label>Password</Form.Label>
                      <InputGroup>
                        <Form.Control
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={form.password}
                          onChange={handleChange}
                          required
                        />
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ border: 'none', background: 'transparent' }}
                        >
                          {showPassword ? '🙈' : '👁️'}
                        </Button>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>
                <Button type="submit" variant="primary" disabled={loading} className="w-100 home-btn">
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </Form>
              {message && <Alert variant="success" className="mt-3">{message}</Alert>}
              {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            </Card.Body>
          </Card>
          <div style={{ textAlign: 'center', marginTop: 16 }} className="homepage-card">
            Don't have an account? <a href="/register">Register here</a>.
          </div>
        </Container>
      </div>
    </div>
  );
}

export default LoginPage;
