import axios from 'axios';
import { getToken } from './tokenService';

const API = '/api/events';

function getJwt() {
  const auth = getToken();
  return auth && auth.token ? auth.token : '';
}

// Get all events (public, but authenticated)
export function getAllEvents() {
  return axios.get(API, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

// Student/Alumni event registration (assume POST /api/events/{eventId}/register)
export function registerForEvent(eventId) {
  return axios.post(`${API}/${eventId}/register`, {}, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

// Faculty: Get all events by faculty
export function getEventsByFaculty(facultyId) {
  return axios.get(`${API}/faculty/${facultyId}`, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

// Faculty: Create event
export function createEvent(facultyId, eventDTO) {
  return axios.post(`${API}/faculty/${facultyId}`, eventDTO, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

// Faculty: Update event
export function updateEvent(eventId, facultyId, eventDTO) {
  return axios.put(`${API}/faculty/${facultyId}/event/${eventId}`, eventDTO, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

// Faculty: Delete event
export function deleteEvent(eventId, facultyId) {
  return axios.delete(`${API}/faculty/${facultyId}/event/${eventId}`, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}
