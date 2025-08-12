import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Form, Button, Alert, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../service/tokenService';
import { getAlumniProfileByUserId, updateAlumniProfileByUserId } from '../service/alumni/alumniSelfService';

const AlumniProfile = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const auth = getToken();
    if (!auth || (auth.role !== 'ROLE_ALUMNI' && auth.role !== 'ALUMNI')) {
      navigate('/not-authorized', { replace: true });
    }
  }, [navigate]);

  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
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
      })
      .catch(() => {
        setError('Failed to fetch profile.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files && files[0]) {
      setProfile({ ...profile, image: URL.createObjectURL(files[0]) });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const userId = localStorage.getItem('userId');
    try {
      await updateAlumniProfileByUserId(userId, profile);
      setEdit(false);
      setMessage('Profile updated!');
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Container className="my-5 text-center"><span>Loading...</span></Container>;
  if (error) return <Container className="my-5"><Alert variant="danger">{error}</Alert></Container>;
  if (!profile) return null;

  return (
    <div className="alumni-bg homepage-flex-wrapper">
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="alumni-card">
              <Card.Body>
                <Card.Title className="text-dark">Alumni Profile</Card.Title>
                <Form onSubmit={handleUpdate}>
                  <Row className="mb-3">
                    <Col md={4} className="text-center">
                      <Image
                        src={profile.image || 'https://via.placeholder.com/120x120?text=Photo'}
                        roundedCircle
                        height={120}
                        width={120}
                        alt="Alumni"
                        className="mb-3"
                      />
                      {edit && (
                        <Form.Group>
                          <Form.Control type="file" name="image" accept="image/*" onChange={handleChange} />
                        </Form.Group>
                      )}
                    </Col>
                    <Col md={8}>
                      <Form.Group className="mb-2">
                        <Form.Label>Name</Form.Label>
                        <Form.Control name="name" value={profile.name} onChange={handleChange} disabled={!edit} />
                      </Form.Group>
                      <Form.Group className="mb-2">
                        <Form.Label>Certificate ID</Form.Label>
                        <Form.Control name="certificateId" value={profile.certificateId} onChange={handleChange} disabled={!edit} />
                      </Form.Group>
                      <Form.Group className="mb-2">
                        <Form.Label>PNR No</Form.Label>
                        <Form.Control name="pnr" value={profile.pnr} onChange={handleChange} disabled={!edit} />
                      </Form.Group>
                      <Form.Group className="mb-2">
                        <Form.Label>Domain</Form.Label>
                        <Form.Control name="domain" value={profile.domain} onChange={handleChange} disabled={!edit} />
                      </Form.Group>
                      <Form.Group className="mb-2">
                        <Form.Label>Company Name</Form.Label>
                        <Form.Control name="company" value={profile.company} onChange={handleChange} disabled={!edit} />
                      </Form.Group>
                      <Form.Group className="mb-2">
                        <Form.Label>Location</Form.Label>
                        <Form.Control name="location" value={profile.location} onChange={handleChange} disabled={!edit} />
                      </Form.Group>
                      <Form.Group className="mb-2">
                        <Form.Label>Batch Year</Form.Label>
                        <Form.Control name="batchYear" value={profile.batchYear} onChange={handleChange} disabled={!edit} />
                      </Form.Group>
                      <Form.Group className="mb-2">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" value={profile.email} onChange={handleChange} disabled={!edit} />
                      </Form.Group>
                      <Form.Group className="mb-2">
                        <Form.Label>Contact No</Form.Label>
                        <Form.Control name="contact" value={profile.contact} onChange={handleChange} disabled={!edit} />
                      </Form.Group>
                      <Form.Group className="mb-2">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control type="date" name="dob" value={profile.dob} onChange={handleChange} disabled={!edit} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="d-flex gap-2 mt-3">
                    {!edit && <Button onClick={() => setEdit(true)} className="alumni-btn">Edit Profile</Button>}
                    {edit && <Button type="submit" className="alumni-btn">Update Profile</Button>}
                  </div>
                </Form>
                {message && <Alert variant="info" className="mt-3">{message}</Alert>}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AlumniProfile;
