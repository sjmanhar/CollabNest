import { getJwt } from './tokenService';
import * as adminService from './admin/adminService';

export function getAlumniList() {
  return adminService.getAllAlumni({ headers: { 'Authorization': `Bearer ${getJwt()}` } }).then(res => res.data);
}

export function addAlumni(data) {
  return adminService.createAlumni(data).then(res => ({ success: true, alumni: res.data }));
}

export function updateAlumni(userId, data) {
  return adminService.updateAlumni(userId, data).then(res => ({ success: true, alumni: res.data }));
}

export function deleteAlumni(userId) {
  return adminService.deleteAlumni(userId).then(res => ({ success: true }));
}
