import axios from 'axios';
import { getToken } from '../tokenService';

function getJwt() {
  const auth = getToken();
  return auth && auth.token ? auth.token : '';
}

const API = '/api/alumni';

export function updateAlumniProfile(alumniDTO) {
  return axios.put(`${API}/update`, alumniDTO, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

export function updateAlumniProfileByUserId(userId, alumniDTO) {
  return axios.put(`${API}/update/by-user/${userId}`, alumniDTO, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

export function getAlumniProfileByUserId(userId) {
  return axios.get(`${API}/by-user/${userId}`, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}
