import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { getFacultyList, addFaculty, updateFaculty, deleteFaculty } from '../service/facultyService';

const initialForm = {
  name: '',
  email: '',
  password: '',
  department: ''
};

function FacultyCRUD() {
  const [faculty, setFaculty] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    getFacultyList().then(data => {
      setFaculty(data.map(f => ({
        id: f.facultyId || f.id,
        name: f.user?.name || f.name || '',
        email: f.user?.email || f.email || '',
        department: f.department || ''
      })));
    });
  }, []);

  const handleShow = (item) => {
    if (item) {
      // Only pick editable fields for the form
      setForm({
        name: item.name || '',
        email: item.email || '',
        password: '', // Blank for edit
        department: item.department || ''
      });
      setEditId(item.id);
    } else {
      setForm(initialForm);
      setEditId(null);
    }
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setForm(initialForm);
    setEditId(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      // Only send allowed fields for update
      const updateData = {
        name: form.name,
        email: form.email,
        password: form.password,
        department: form.department
      };
      const res = await updateFaculty(editId, updateData);
      setFaculty(faculty.map(f => (f.id === editId ? res.faculty : f)));
    } else {
      const res = await addFaculty(form);
      setFaculty([...faculty, res.faculty]);
    }
    handleClose();
  };

  const handleDelete = async (id) => {
    await deleteFaculty(id);
    setFaculty(faculty.filter(f => f.id !== id));
  };

  return (
    <div className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Faculty Management</h4>
        <Button variant="primary" onClick={() => handleShow(null)}>Add Faculty</Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {faculty.map((f) => (
            <tr key={f.id}>
              <td>{f.name}</td>
              <td>{f.email}</td>
              <td>{f.department}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleShow(f)}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(f.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={showModal} onHide={handleClose}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{editId ? 'Edit Faculty' : 'Add Faculty'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" value={form.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control name="email" type="email" value={form.email} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control name="password" type="password" value={form.password} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Department</Form.Label>
              <Form.Control name="department" value={form.department} onChange={handleChange} required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            <Button variant="primary" type="submit">{editId ? 'Update' : 'Add'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default FacultyCRUD;
