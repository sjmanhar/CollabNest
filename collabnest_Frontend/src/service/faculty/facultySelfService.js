import axios from 'axios';
import { getToken } from '../tokenService';

function getJwt() {
  const auth = getToken();
  return auth && auth.token ? auth.token : '';
}

const API = '/api/faculty';

export function updateFacultyProfile(facultyDTO) {
  return axios.put(`${API}/update`, facultyDTO, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

export function updateFacultyProfileByUserId(userId, facultyDTO) {
  return axios.put(`${API}/update/by-user/${userId}`, facultyDTO, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

export function getFacultyProfileByUserId(userId) {
  return axios.get(`${API}/profile/${userId}`, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}
