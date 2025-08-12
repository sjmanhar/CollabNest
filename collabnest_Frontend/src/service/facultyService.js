import { getJwt } from './tokenService';
import * as adminService from './admin/adminService';

export function getFacultyList() {
  return adminService.getAllFaculty({ 'Authorization': `Bearer ${getJwt()}` }).then(res => res.data);
}

export function addFaculty(data) {
  return adminService.createFaculty(data).then(res => ({ success: true, faculty: res.data }));
}

export function updateFaculty(userId, data) {
  return adminService.updateFaculty(userId, data).then(res => ({ success: true, faculty: res.data }));
}

export function deleteFaculty(userId) {
  return adminService.deleteFaculty(userId).then(res => ({ success: true }));
}
