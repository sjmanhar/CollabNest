import React from 'react';
import { Container } from 'react-bootstrap';
import FacultyCRUD from '../components/FacultyCRUD';
import AlumniCRUD from '../components/AlumniCRUD';
import StudentCRUD from '../components/StudentCRUD';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../service/tokenService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const auth = getToken();
    if (!auth || (auth.role !== 'ROLE_ADMIN' && auth.role !== 'ADMIN')) {
      navigate('/not-authorized', { replace: true });
    }
  }, [navigate]);

  return (
    <Container className="my-4">
      <h2 className="mb-4">Admin Dashboard</h2>
      <FacultyCRUD />
      <AlumniCRUD />
      <StudentCRUD />
    </Container>
  );
}

export default AdminDashboard;
