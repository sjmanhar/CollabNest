import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { getStudentList, addStudent, updateStudent, deleteStudent } from '../service/studentService';

const initialForm = {
  name: '',
  email: '',
  password: '',
  prn: ''
};

function StudentCRUD() {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    getStudentList().then(data => {
      setStudents(data.map(s => ({
        id: s.studentId || s.id,
        name: s.user?.name || s.name || '',
        email: s.user?.email || s.email || '',
        year: s.year || ''
      })));
    });
  }, []);

  const handleShow = (item) => {
    if (item) {
      setForm({
        name: item.name || '',
        email: item.email || '',
        password: '',
        prn: item.prn || ''
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
        prn: form.prn
      };
      const res = await updateStudent(editId, updateData);
      setStudents(students.map(s => (s.id === editId ? res.student : s)));
    } else {
      const res = await addStudent(form);
      setStudents([...students, res.student]);
    }
    handleClose();
  };

  const handleDelete = async (id) => {
    await deleteStudent(id);
    setStudents(students.filter(s => s.id !== id));
  };

  return (
    <div className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Student Management</h4>
        <Button variant="primary" onClick={() => handleShow(null)}>Add Student</Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Year</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.year}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleShow(s)}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(s.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={showModal} onHide={handleClose}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{editId ? 'Edit Student' : 'Add Student'}</Modal.Title>
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

export default StudentCRUD;
