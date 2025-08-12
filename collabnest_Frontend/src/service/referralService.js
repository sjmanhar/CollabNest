import axios from 'axios';
import { getToken } from './tokenService';

function getJwt() {
  const auth = getToken();
  return auth && auth.token ? auth.token : '';
}

const API = '/api/referrals';

// Get all referrals
export function getAllReferrals() {
  return axios.get(API, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

// Get referrals by alumni
export function getReferralsByAlumni(alumniId) {
  return axios.get(`${API}/alumni/${alumniId}`, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

// Create referral (alumni only)
export function createReferral(alumniId, referral) {
  return axios.post(`${API}/alumni/${alumniId}`, referral, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

// Update referral (alumni only)
export function updateReferral(referralId, alumniId, referral) {
  return axios.put(`${API}/${referralId}/alumni/${alumniId}`, referral, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

// Delete referral (alumni only)
export function deleteReferral(referralId, alumniId) {
  return axios.delete(`${API}/${referralId}/alumni/${alumniId}`, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

// Student apply for referral (legacy, keep for compatibility)
export function applyForReferral(referralId, studentId) {
  return axios.post(`${API}/${referralId}/apply/${studentId}`, {}, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

// Referral Application API (new)
const APPLICATION_API = '/api/referral-applications';

// Student applies for referral
export function applyForReferralApplication(referralId, studentId) {
  return axios.post(`${APPLICATION_API}/apply/${referralId}/${studentId}`, {}, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

// Alumni gets all applicants for a referral
export function getApplicantsByReferral(referralId) {
  return axios.get(`${APPLICATION_API}/referral/${referralId}/applicants`, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

// Student gets all their applications
export function getApplicationsByStudent(studentId) {
  return axios.get(`${APPLICATION_API}/student/${studentId}`, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}

// Alumni approves an applicant (others get rejected)
export function approveReferralApplicant(applicationId) {
  return axios.post(`${APPLICATION_API}/approve/${applicationId}`, {}, {
    headers: { 'Authorization': `Bearer ${getJwt()}` }
  });
}
