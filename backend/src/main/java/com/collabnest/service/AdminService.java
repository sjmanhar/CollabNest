package com.collabnest.service;

import com.collabnest.model.Student;
import com.collabnest.model.Alumni;
import com.collabnest.model.Faculty;
import com.collabnest.dto.AdminUpdateStudentDTO;
import com.collabnest.dto.AdminUpdateAlumniDTO;
import com.collabnest.dto.AdminUpdateFacultyDTO;
import com.collabnest.repository.StudentRepository;
import com.collabnest.repository.AlumniRepository;
import com.collabnest.repository.FacultyRepository;
import com.collabnest.model.User;
import com.collabnest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AdminService implements AdminServiceInterface {
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private AlumniRepository alumniRepository;
    @Autowired
    private FacultyRepository facultyRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // STUDENT CRUD
    @Override
    public Student updateStudentByUserId(AdminUpdateStudentDTO dto) {
        if (dto.getUserId() == null) throw new RuntimeException("UserId is required");
        User user = userRepository.findById(dto.getUserId()).orElseThrow(() -> new RuntimeException("User not found for userId: " + dto.getUserId()));
        Student student = studentRepository.findByUserId(dto.getUserId());
        if (student == null) throw new RuntimeException("Student not found for userId: " + dto.getUserId());
        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getPassword() != null) user.setPassword(passwordEncoder.encode(dto.getPassword()));
        if (dto.getPrn() != null) student.setPrn(dto.getPrn());
        userRepository.save(user);
        return studentRepository.save(student);
    }

    @Override
    public Student createStudent(AdminUpdateStudentDTO dto) {
        if (dto.getEmail() == null || dto.getPassword() == null || dto.getName() == null) {
            throw new RuntimeException("Missing required fields");
        }
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(com.collabnest.model.Role.STUDENT);
        user.setVerified(true);
        User savedUser = userRepository.save(user);

        Student student = new Student();
        student.setUser(savedUser);
        student.setPrn(dto.getPrn());
        // Set other fields if present in DTO
        Student savedStudent = studentRepository.save(student);
        return savedStudent;
    }

    @Override
    public void deleteStudentByUserId(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found for userId: " + userId));
        Student student = studentRepository.findByUserId(userId);
        if (student == null) throw new RuntimeException("Student not found for userId: " + userId);
        studentRepository.delete(student);
    }

    @Override
    public Student getStudentByUserId(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found for userId: " + userId));
        Student student = studentRepository.findByUserId(userId);
        if (student == null) throw new RuntimeException("Student not found for userId: " + userId);
        return student;
    }

    @Override
    public java.util.List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // ALUMNI CRUD
    @Override
    public Alumni updateAlumniByUserId(AdminUpdateAlumniDTO dto) {
        if (dto.getUserId() == null) throw new RuntimeException("UserId is required");
        User user = userRepository.findById(dto.getUserId()).orElseThrow(() -> new RuntimeException("User not found for userId: " + dto.getUserId()));
        Alumni alumni = alumniRepository.findByUserId(dto.getUserId());
        if (alumni == null) throw new RuntimeException("Alumni not found for userId: " + dto.getUserId());
        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getPassword() != null) user.setPassword(passwordEncoder.encode(dto.getPassword()));
        if (dto.getPrn() != null) alumni.setPrn(dto.getPrn());
        if (dto.getCertificateId() != null) alumni.setCertificateId(dto.getCertificateId());
        userRepository.save(user);
        return alumniRepository.save(alumni);
    }

    @Override
    public void deleteAlumniByUserId(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found for userId: " + userId));
        Alumni alumni = alumniRepository.findByUserId(userId);
        if (alumni == null) throw new RuntimeException("Alumni not found for userId: " + userId);
        alumniRepository.delete(alumni);
    }

    @Override
    public Alumni getAlumniByUserId(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found for userId: " + userId));
        Alumni alumni = alumniRepository.findByUserId(userId);
        if (alumni == null) throw new RuntimeException("Alumni not found for userId: " + userId);
        return alumni;
    }

    @Override
    public Alumni createAlumni(AdminUpdateAlumniDTO dto) {
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(com.collabnest.model.Role.ALUMNI);
        user.setVerified(false);
        userRepository.save(user);
        Alumni alumni = new Alumni();
        alumni.setUser(user);
        alumni.setPrn(dto.getPrn());
        alumni.setCertificateId(dto.getCertificateId());
        alumni.setIsVerified(false);
        alumni.setCreatedAt(java.time.LocalDateTime.now());
        alumni.setUpdatedAt(java.time.LocalDateTime.now());
        return alumniRepository.save(alumni);
    }

    @Override
    public java.util.List<Alumni> getAllAlumni() {
        return alumniRepository.findAll();
    }

    // FACULTY CRUD

    @Override
    public Faculty updateFacultyByUserId(AdminUpdateFacultyDTO dto) {
        if (dto.getUserId() == null) throw new RuntimeException("UserId is required");
        User user = userRepository.findById(dto.getUserId()).orElseThrow(() -> new RuntimeException("User not found for userId: " + dto.getUserId()));
        Faculty faculty = facultyRepository.findByUserId(dto.getUserId());
        if (faculty == null) throw new RuntimeException("Faculty not found for userId: " + dto.getUserId());
        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getPassword() != null) user.setPassword(passwordEncoder.encode(dto.getPassword()));
        if (dto.getDepartment() != null) faculty.setDepartment(dto.getDepartment());
        userRepository.save(user);
        return facultyRepository.save(faculty);
    }

    @Override
    public void deleteFacultyByUserId(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found for userId: " + userId));
        Faculty faculty = facultyRepository.findByUserId(userId);
        if (faculty == null) throw new RuntimeException("Faculty not found for userId: " + userId);
        facultyRepository.delete(faculty);
    }

    @Override
    public Faculty getFacultyByUserId(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found for userId: " + userId));
        Faculty faculty = facultyRepository.findByUserId(userId);
        if (faculty == null) throw new RuntimeException("Faculty not found for userId: " + userId);
        return faculty;
    }

    @Override
    public Faculty createFaculty(AdminUpdateFacultyDTO dto) {
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(com.collabnest.model.Role.FACULTY);
        user.setVerified(true);
        userRepository.save(user);
        Faculty faculty = new Faculty();
        faculty.setUser(user);
        faculty.setDepartment(dto.getDepartment());
        return facultyRepository.save(faculty);
    }







    @Override
    public java.util.List<Faculty> getAllFaculty() {
        return facultyRepository.findAll();
    }
}
