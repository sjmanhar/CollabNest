import axios from 'axios';
import { getToken } from '../tokenService';

const API = '/api/admin';

function getJwt() {
  const auth = getToken();
  return auth && auth.token ? auth.token : '';
}
export function getAllFaculty() {
  return axios.get(`${API}/faculties`, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}


// STUDENT CRUD
export function getStudent(userId) {
  return axios.get(`${API}/student/${userId}`, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

export function getAllStudents() {
  return axios.get(`${API}/students`, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

export function createStudent(studentDTO) {
  return axios.post(`${API}/student`, studentDTO, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

export function updateStudent(userId, studentDTO) {
  return axios.put(`${API}/student/${userId}`, studentDTO, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

export function deleteStudent(userId) {
  return axios.delete(`${API}/student/${userId}`, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

// FACULTY CRUD
export function createFaculty(facultyDTO) {
  return axios.post(`${API}/faculty`, facultyDTO, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

export function createAlumni(alumniDTO) {
  return axios.post(`${API}/alumni`, alumniDTO, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

// ALUMNI CRUD
export function getAlumni(userId) {
  return axios.get(`${API}/alumni/${userId}`, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

export function getAllAlumni() {
  return axios.get(`${API}/alumnis`, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

export function updateAlumni(userId, alumniDTO) {
  return axios.put(`${API}/alumni/${userId}`, alumniDTO, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

export function deleteAlumni(userId) {
  return axios.delete(`${API}/alumni/${userId}`, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}
