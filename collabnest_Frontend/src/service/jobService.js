import axios from 'axios';
import { getToken } from './tokenService';

function getJwt() {
  const auth = getToken();
  return auth && auth.token ? auth.token : '';
}

const API = '/api/jobs';

// Alumni: Get jobs by alumni
export function getJobsByAlumni(alumniId) {
  return axios.get(`${API}/alumni/${alumniId}`, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

// Alumni: Create job
export function createJobByAlumni(alumniId, job) {
  return axios.post(`${API}/alumni/${alumniId}`, job, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

// Alumni: Update job
export function updateJobByAlumni(jobId, alumniId, job) {
  return axios.put(`${API}/${jobId}/alumni/${alumniId}`, job, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

// Alumni: Delete job
export function deleteJobByAlumni(jobId, alumniId) {
  return axios.delete(`${API}/${jobId}/alumni/${alumniId}`, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}


// Get all job openings
export function getAllJobs() {
  return axios.get(API, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

// Get jobs by faculty
export function getJobsByFaculty(facultyId) {
  return axios.get(`${API}/faculty/${facultyId}`, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

// Create job opening (faculty only)
export function createJob(facultyId, job) {
  return axios.post(`${API}/faculty/${facultyId}`, job, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

// Update job opening (faculty only)
export function updateJob(jobId, facultyId, job) {
  return axios.put(`${API}/${jobId}/faculty/${facultyId}`, job, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

// Delete job opening (faculty only)
export function deleteJob(jobId, facultyId) {
  return axios.delete(`${API}/${jobId}/faculty/${facultyId}`, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}
