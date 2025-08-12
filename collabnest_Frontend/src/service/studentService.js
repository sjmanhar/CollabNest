import { getJwt } from './tokenService';
import * as adminService from './admin/adminService';

export function getStudentList() {
  return adminService.getAllStudents({ headers: { 'Authorization': `Bearer ${getJwt()}` } }).then(res => res.data);
}

export function addStudent(data) {
  return adminService.createStudent(data).then(res => ({ success: true, student: res.data }));
}

export function updateStudent(userId, data) {
  return adminService.updateStudent(userId, data).then(res => ({ success: true, student: res.data }));
}

export function deleteStudent(userId) {
  return adminService.deleteStudent(userId).then(res => ({ success: true }));
}
