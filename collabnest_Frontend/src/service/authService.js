import axios from 'axios';

const API = '/api/auth';

export function registerStudent(studentDTO) {
  return axios.post(`${API}/register/student`, studentDTO);
}

export function registerAlumni(alumniDTO) {
  return axios.post(`${API}/register/alumni`, alumniDTO);
}

import { getToken } from "./tokenService";

export function registerFaculty(facultyDTO) {
  const tokenObj = getToken();
  const jwt = tokenObj && tokenObj.token ? tokenObj.token : null;
  return axios.post(
    `${API}/register/faculty`,
    facultyDTO,
    jwt ? {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    } : {}
  );
}

export function login(user) {
  return axios.post(`${API}/login`, user);
}
