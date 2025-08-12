import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Form, Button, Alert, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../service/tokenService';
import { getFacultyProfileByUserId, updateFacultyProfileByUserId } from '../service/faculty/facultySelfService';

const FacultyProfile = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getToken();
    if (!auth || (auth.role !== 'ROLE_FACULTY' && auth.role !== 'FACULTY')) {
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
    getFacultyProfileByUserId(userId)
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
    if (name === 'photo' && files && files[0]) {
      setProfile({ ...profile, photo: URL.createObjectURL(files[0]) });
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
      await updateFacultyProfileByUserId(userId, profile);
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
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>Faculty Profile</Card.Title>
              <Form onSubmit={handleUpdate}>
                <Row className="mb-3">
                  <Col md={4} className="text-center">
                    <Image
                      src={profile.photo || 'https://via.placeholder.com/120x120?text=Photo'}
                      roundedCircle
                      height={120}
                      width={120}
                      alt="Faculty"
                      className="mb-3"
                    />
                    {edit && (
                      <Form.Group>
                        <Form.Control type="file" name="photo" accept="image/*" onChange={handleChange} />
                      </Form.Group>
                    )}
                  </Col>
                  <Col md={8}>
                    <Form.Group className="mb-2">
                      <Form.Label>Faculty ID</Form.Label>
                      <Form.Control name="facultyid" value={profile.facultyid} disabled readOnly />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Name</Form.Label>
                      <Form.Control name="name" value={profile.name} onChange={handleChange} disabled={!edit} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Department</Form.Label>
                      <Form.Control name="department" value={profile.department} onChange={handleChange} disabled={!edit} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Location</Form.Label>
                      <Form.Control name="location" value={profile.location} onChange={handleChange} disabled={!edit} />
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
                  {!edit && <Button onClick={() => setEdit(true)} variant="outline-primary">Edit Profile</Button>}
                  {edit && <Button type="submit" variant="success">Update Profile</Button>}
                </div>
              </Form>
              {message && <Alert variant="info" className="mt-3">{message}</Alert>}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FacultyProfile;
