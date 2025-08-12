package com.collabnest.service;

import com.collabnest.dto.AdminUpdateStudentDTO;
import com.collabnest.dto.AdminUpdateAlumniDTO;
import com.collabnest.dto.AdminUpdateFacultyDTO;
import com.collabnest.model.Student;
import com.collabnest.model.Alumni;
import com.collabnest.model.Faculty;
import java.util.List;

public interface AdminServiceInterface {
    // Student CRUD by email
    Student updateStudentByUserId(AdminUpdateStudentDTO dto);
    void deleteStudentByUserId(Long userId);
    Student getStudentByUserId(Long userId);
    java.util.List<Student> getAllStudents();

    // Alumni CRUD by email
    Alumni updateAlumniByUserId(AdminUpdateAlumniDTO dto);
    void deleteAlumniByUserId(Long userId);
    Alumni getAlumniByUserId(Long userId);
    java.util.List<Alumni> getAllAlumni();

    // Faculty CRUD by userId
    Faculty updateFacultyByUserId(AdminUpdateFacultyDTO dto);
    void deleteFacultyByUserId(Long userId);
    Faculty getFacultyByUserId(Long userId);
    java.util.List<Faculty> getAllFaculty();

    // Create methods
    Student createStudent(AdminUpdateStudentDTO dto);
    Alumni createAlumni(AdminUpdateAlumniDTO dto);
    Faculty createFaculty(AdminUpdateFacultyDTO dto);
}
