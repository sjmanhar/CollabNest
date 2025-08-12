package com.collabnest.service;

import com.collabnest.model.Student;
import com.collabnest.dto.StudentRegistrationDTO;
import java.util.Optional;

public interface StudentServiceInterface {
    Optional<Student> findById(Long id);
    Student save(Student student);
    Student mapRegistrationDtoToEntity(StudentRegistrationDTO dto);
}
