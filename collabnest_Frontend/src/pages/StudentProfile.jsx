import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Button, Form, Image, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../service/tokenService';
import { getStudentProfileByUserId, updateStudentProfileByUserId } from '../service/student/studentSelfService';

const StudentProfile = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const auth = getToken();
    if (!auth || (auth.role !== 'ROLE_STUDENT' && auth.role !== 'STUDENT')) {
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
    getStudentProfileByUserId(userId)
      .then(res => {
        setProfile(res.data);
        if (res.data && res.data.id) {
          localStorage.setItem('studentId', res.data.id);
        }
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
      await updateStudentProfileByUserId(userId, profile);
      setEdit(false);
      setMessage('Profile updated!');
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = () => {
    setMessage('Role change requested (dummy)!');
  };

  if (loading) return <Container className="my-5 text-center"><span>Loading...</span></Container>;
  if (error) return <Container className="my-5"><Alert variant="danger">{error}</Alert></Container>;
  if (!profile) return null;

  return (
    <div className="homepage-bg homepage-flex-wrapper">
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 w-100">
        <Container className="my-5" style={{ maxWidth: 700 }}>
          <Row className="justify-content-center">
            <Col md={7}>
              <Card className="homepage-card">
                <Card.Body>
                  <Card.Title>Student Profile</Card.Title>
                  <div className="text-center mb-3">
                    <Image src={profile.photo} roundedCircle width={100} height={100} alt="Profile" />
                    {edit && (
                      <Form.Group className="mt-2">
                        <Form.Control type="file" name="photo" onChange={handleChange} accept="image/*" />
                      </Form.Group>
                    )}
                  </div>
                  <Form onSubmit={handleUpdate}>
                    <Form.Group className="mb-2">
                      <Form.Label>Name</Form.Label>
                      <Form.Control name="name" value={profile.user?.name || ''} onChange={handleChange} readOnly={!edit} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>ID</Form.Label>
                      <Form.Control name="id" value={profile.id} readOnly disabled />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>PRN</Form.Label>
                      <Form.Control name="prn" value={profile.prn} readOnly disabled />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Branch</Form.Label>
                      <Form.Control name="branch" value={profile.branch} onChange={handleChange} readOnly={!edit} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Email</Form.Label>
                      <Form.Control name="email" value={profile.user?.email || ''} onChange={handleChange} readOnly={!edit} type="email" />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Phone No</Form.Label>
                      <Form.Control name="phone" value={profile.user?.phoneNumber || ''} onChange={handleChange} readOnly={!edit} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Date of Birth</Form.Label>
                      <Form.Control name="dob" value={profile.dob} onChange={handleChange} readOnly={!edit} type="date" />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Resume URL</Form.Label>
                      <Form.Control name="resumeUrl" value={profile.resumeUrl} onChange={handleChange} readOnly={!edit} type="url" />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Year</Form.Label>
                      <Form.Control name="year" value={profile.year} onChange={handleChange} readOnly={!edit} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Location (Hometown)</Form.Label>
                      <Form.Control name="location" value={profile.location} onChange={handleChange} readOnly={!edit} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Graduation Certificate ID</Form.Label>
                      <Form.Control name="certificateId" value={profile.certificateId} onChange={handleChange} readOnly={!edit} />
                    </Form.Group>
                    <div className="d-flex gap-2 mt-3">
                      {!edit && <Button onClick={() => setEdit(true)} className="home-btn">Edit Profile</Button>}
                      {edit && <Button type="submit" variant="success" className="home-btn">Update Profile</Button>}
                      <Button variant="secondary" className="home-btn" onClick={handleRoleChange}>Change Role to Alumni</Button>
                    </div>
                  </Form>
                  {message && <Alert variant="info" className="mt-3">{message}</Alert>}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default StudentProfile;
