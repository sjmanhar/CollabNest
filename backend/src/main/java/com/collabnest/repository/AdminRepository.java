package com.collabnest.repository;

import com.collabnest.model.Alumni;
import com.collabnest.model.Student;
import com.collabnest.model.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Student, Integer> {
    // For Student CRUD only (if needed)
    Student findStudentByStudentId(Integer studentId);
    void deleteStudentByStudentId(Integer studentId);
}

