import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { getAlumniList, addAlumni, updateAlumni, deleteAlumni } from '../service/alumniService';

const initialForm = {
  name: '',
  email: '',
  password: '',
  prn: '',
  certificateId: ''
};

function AlumniCRUD() {
  const [alumni, setAlumni] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    getAlumniList().then(data => {
      setAlumni(data.map(a => ({
        id: a.alumniId || a.id,
        name: a.user?.name || a.name || '',
        email: a.user?.email || a.email || '',
        batch: a.batch || a.batchYear || ''
      })));
    });
  }, []);

  const handleShow = (item) => {
    if (item) {
      setForm({
        name: item.name || '',
        email: item.email || '',
        password: '',
        prn: item.prn || '',
        certificateId: item.certificateId || ''
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
      const updateData = {
        name: form.name,
        email: form.email,
        password: form.password,
        prn: form.prn,
        certificateId: form.certificateId
      };
      const res = await updateAlumni(editId, updateData);
      setAlumni(alumni.map(a => (a.id === editId ? res.alumni : a)));
    } else {
      const res = await addAlumni(form);
      setAlumni([...alumni, res.alumni]);
    }
    handleClose();
  };

  const handleDelete = async (id) => {
    await deleteAlumni(id);
    setAlumni(alumni.filter(a => a.id !== id));
  };

  return (
    <div className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Alumni Management</h4>
        <Button variant="primary" onClick={() => handleShow(null)}>Add Alumni</Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Batch</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {alumni.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.email}</td>
              <td>{a.batch}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleShow(a)}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(a.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={showModal} onHide={handleClose}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{editId ? 'Edit Alumni' : 'Add Alumni'}</Modal.Title>
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
              <Form.Label>PRN</Form.Label>
              <Form.Control name="prn" value={form.prn} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Certificate ID</Form.Label>
              <Form.Control name="certificateId" value={form.certificateId} onChange={handleChange} required />
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

export default AlumniCRUD;
