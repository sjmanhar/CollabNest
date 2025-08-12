package com.collabnest.service;

import com.collabnest.model.User;
import com.collabnest.model.Student;
import com.collabnest.dto.StudentRegistrationDTO;
import com.collabnest.dto.AlumniRegistrationDTO;
import com.collabnest.dto.FacultyRegistrationDTO;
import com.collabnest.model.Alumni;
import com.collabnest.model.Faculty;
import com.collabnest.repository.UserRepository;
import com.collabnest.repository.StudentRepository;
import com.collabnest.repository.AlumniRepository;
import com.collabnest.repository.FacultyRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService implements AuthServiceInterface {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private AlumniRepository alumniRepository;
    @Autowired
    private FacultyRepository facultyRepository;

    public Object registerStudent(StudentRegistrationDTO student) {
        if (student.getEmail() == null || student.getPassword() == null || student.getConfirmPassword() == null) {
            return "Missing required fields";
        }
        if (!student.getPassword().equals(student.getConfirmPassword())) {
            return "Passwords do not match";
        }
        Optional<User> existing = userRepository.findByEmail(student.getEmail());
        if (existing.isPresent()) {
            return "Email already registered";
        }
        // Save user fields
        User user = new User();
        user.setName(student.getName());
        user.setEmail(student.getEmail());
        user.setPassword(passwordEncoder.encode(student.getPassword()));
        user.setRole(com.collabnest.model.Role.STUDENT);
        user.setVerified(true);
        User savedUser = userRepository.save(user);
        // Save student fields
        Student studentEntity = modelMapper.map(student, Student.class);
        studentEntity.setUser(savedUser);
        studentEntity.setImgUrl(null); // handle image upload separately
        studentEntity.setResumeUrl(null); // handle resume upload separately
        studentEntity.setIsVerifiedAlumni(false);
        Student savedStudent = studentRepository.save(studentEntity);
        return savedStudent;
    }

    public Object registerAlumni(AlumniRegistrationDTO alumni) {
        try {
            if (alumni.getEmail() == null || alumni.getPassword() == null || alumni.getConfirmPassword() == null) {
                return "Missing required fields";
            }
            if (!alumni.getPassword().equals(alumni.getConfirmPassword())) {
                return "Passwords do not match";
            }
            Optional<User> existing = userRepository.findByEmail(alumni.getEmail());
            if (existing.isPresent()) {
                return "Email already registered";
            }
            // Save user fields
            User user = new User();
            user.setName(alumni.getName());
            user.setEmail(alumni.getEmail());
            user.setPassword(passwordEncoder.encode(alumni.getPassword()));
            user.setRole(com.collabnest.model.Role.ALUMNI);
            user.setVerified(false); // Alumni must be verified by admin
            User savedUser = userRepository.save(user);
            // Save alumni fields
            Alumni alumniEntity = modelMapper.map(alumni, Alumni.class);
            alumniEntity.setUser(savedUser);
            alumniEntity.setAlumniId(null);
            alumniEntity.setIsVerified(false);
            alumniEntity.setCreatedAt(java.time.LocalDateTime.now());
            alumniEntity.setUpdatedAt(java.time.LocalDateTime.now());
            Alumni savedAlumni = alumniRepository.save(alumniEntity);
            return savedAlumni;
        } catch (Exception e) {
            e.printStackTrace();
            return "Alumni registration failed: " + e.getMessage();
        }
    }

    public Object registerFaculty(FacultyRegistrationDTO faculty) {
        if (faculty.getEmail() == null || faculty.getPassword() == null || faculty.getConfirmPassword() == null) {
            return "Missing required fields";
        }
        if (!faculty.getPassword().equals(faculty.getConfirmPassword())) {
            return "Passwords do not match";
        }
        Optional<User> existing = userRepository.findByEmail(faculty.getEmail());
        if (existing.isPresent()) {
            return "Email already registered";
        }
        // Save user fields
        User user = new User();
        user.setName(faculty.getName());
        user.setEmail(faculty.getEmail());
        user.setPassword(passwordEncoder.encode(faculty.getPassword()));
        user.setRole(com.collabnest.model.Role.FACULTY);
        user.setVerified(true);
        User savedUser = userRepository.save(user);
        // Save faculty fields
        Faculty facultyEntity = modelMapper.map(faculty, Faculty.class);
        facultyEntity.setUser(savedUser);
        Faculty savedFaculty = facultyRepository.save(facultyEntity);
        return savedFaculty;
    }


    @Override
    public Object login(String email, String rawPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            System.out.println("Login failed: user not found for email " + email);
            return "Invalid credentials";
        }
        User user = userOpt.get();
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            System.out.println("Login failed: password mismatch for email " + email);
            return "Invalid credentials";
        }
        // If alumni, check verification status
        if (user.getRole() == com.collabnest.model.Role.ALUMNI && !user.isVerified()) {
            System.out.println("Login failed: alumni not verified for email " + email);
            return "Alumni account not verified by admin.";
        }
        return user;
    }
}

