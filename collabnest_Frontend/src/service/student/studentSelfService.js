import axios from 'axios';
import { getToken } from '../tokenService';

function getJwt() {
  const auth = getToken();
  return auth && auth.token ? auth.token : '';
}

const API = '/api/student';

export function updateStudentProfile(studentDTO) {
  return axios.put(`${API}/update`, studentDTO, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

export function updateStudentProfileByUserId(userId, studentDTO) {
  return axios.put(`${API}/update/by-user/${userId}`, studentDTO, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

export function getStudentProfileByUserId(userId) {
  return axios.get(`${API}/by-user/${userId}`, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}
