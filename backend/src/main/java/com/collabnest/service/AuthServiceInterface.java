package com.collabnest.service;

import com.collabnest.dto.StudentRegistrationDTO;
import com.collabnest.dto.AlumniRegistrationDTO;
import com.collabnest.dto.FacultyRegistrationDTO;

public interface AuthServiceInterface {
    Object registerStudent(StudentRegistrationDTO student);
    Object registerAlumni(AlumniRegistrationDTO alumni);
    Object registerFaculty(FacultyRegistrationDTO faculty);
    Object login(String email, String rawPassword);
}
