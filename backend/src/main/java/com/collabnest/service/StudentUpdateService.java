package com.collabnest.service;

import com.collabnest.dto.ApiResponse;

import com.collabnest.dto.StudentUpdateDTO;
import com.collabnest.model.Student;
import com.collabnest.model.User;
import com.collabnest.repository.StudentRepository;
import com.collabnest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class StudentUpdateService {
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public StudentUpdateService(StudentRepository studentRepository, UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Student updateStudent(StudentUpdateDTO dto) {
        Student student = null;
        if (dto.getUserId() != null) {
            student = studentRepository.findByUserId(dto.getUserId());
        } else if (dto.getStudentId() != null) {
            Optional<Student> studentOpt = studentRepository.findById(dto.getStudentId());
            if (studentOpt.isPresent()) {
                student = studentOpt.get();
            }
        }
        if (student == null) throw new RuntimeException("Student not found");
        User user = student.getUser();
        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        // No password or prn in StudentUpdateDTO
        if (dto.getBranch() != null) student.setBranch(dto.getBranch());
        if (dto.getYear() != null) student.setYear(dto.getYear());
        if (dto.getResumeUrl() != null) student.setResumeUrl(dto.getResumeUrl());

        if (dto.getPhoneNumber() != null) user.setPhoneNumber(dto.getPhoneNumber());
        userRepository.save(user);
        return studentRepository.save(student);
    }

    public ApiResponse updateDetails(Long userId, StudentUpdateDTO dto) {
        Student student = studentRepository.findByUserId(userId);
        if (student == null) throw new RuntimeException("Student not found for userId: " + userId);
        User user = student.getUser();
        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        if (dto.getBranch() != null) student.setBranch(dto.getBranch());
        if (dto.getYear() != null) student.setYear(dto.getYear());
        if (dto.getResumeUrl() != null) student.setResumeUrl(dto.getResumeUrl());
        if (dto.getPhoneNumber() != null) user.setPhoneNumber(dto.getPhoneNumber());
        userRepository.save(user);
        studentRepository.save(student);
        return new ApiResponse("Updated student details.");
    }

    public Student getStudentByUserId(Long userId) {
        return studentRepository.findByUserId(userId);
    }
}
