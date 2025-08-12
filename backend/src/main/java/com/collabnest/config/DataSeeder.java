package com.collabnest.config;

import com.collabnest.model.*;
import com.collabnest.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

@Configuration
public class DataSeeder {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FacultyRepository facultyRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private AlumniRepository alumniRepository;
    @Autowired
    private FacultyProfileRepository facultyProfileRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner seedData() {
        return args -> {
            // Admin
            Optional<User> adminOpt = userRepository.findByEmail("admin@collabnest.com");
            if (adminOpt.isEmpty()) {
                User admin = new User();
                admin.setName("Super Admin");
                admin.setEmail("admin@collabnest.com");
                admin.setPassword(passwordEncoder.encode("Admin@123"));
                admin.setRole(Role.ADMIN);
                admin.setPhoneNumber("9999999999");
                admin.setVerified(true);
                userRepository.save(admin);
            }

            // Faculty
            Optional<User> facultyOpt = userRepository.findByEmail("faculty@collabnest.com");
            User savedFacultyUser;
            if (facultyOpt.isEmpty()) {
                User facultyUser = new User();
                facultyUser.setName("Faculty User");
                facultyUser.setEmail("faculty@collabnest.com");
                facultyUser.setPassword(passwordEncoder.encode("Faculty@123"));
                facultyUser.setRole(Role.FACULTY);
                facultyUser.setPhoneNumber("8888888888");
                facultyUser.setVerified(true);
                savedFacultyUser = userRepository.save(facultyUser);

                Faculty faculty = new Faculty();
                faculty.setUser(savedFacultyUser);
                faculty.setDepartment("Computer Science");
                faculty.setLocation("Campus Block A");
                facultyRepository.save(faculty);
            } else {
                savedFacultyUser = facultyOpt.get();
            }

            // Seed FacultyProfile for faculty user if not present
            if (facultyProfileRepository.findByUserId(savedFacultyUser.getId()).isEmpty()) {
                FacultyProfile profile = new FacultyProfile();
                profile.setUser(savedFacultyUser);
                profile.setName(savedFacultyUser.getName());
                profile.setDepartment("Computer Science");
                profile.setLocation("Campus Block A");
                profile.setEmail(savedFacultyUser.getEmail());
                profile.setDob(java.time.LocalDate.of(1980, 1, 1)); // Example DOB
                facultyProfileRepository.save(profile);
            }

            // Student
            Optional<User> studentOpt = userRepository.findByEmail("student@collabnest.com");
            if (studentOpt.isEmpty()) {
                User studentUser = new User();
                studentUser.setName("Student User");
                studentUser.setEmail("student@collabnest.com");
                studentUser.setPassword(passwordEncoder.encode("Student@123"));
                studentUser.setRole(Role.STUDENT);
                studentUser.setPhoneNumber("7777777777");
                studentUser.setVerified(true);
                User savedStudentUser = userRepository.save(studentUser);

                Student student = new Student();
                student.setUser(savedStudentUser);
                student.setYear("3");
                student.setResumeUrl(null);
                student.setImgUrl(null);
                student.setIsVerifiedAlumni(false);
                studentRepository.save(student);
            }

            // Alumni
            Optional<User> alumniOpt = userRepository.findByEmail("alumni@collabnest.com");
            if (alumniOpt.isEmpty()) {
                User alumniUser = new User();
                alumniUser.setName("Alumni User");
                alumniUser.setEmail("alumni@collabnest.com");
                alumniUser.setPassword(passwordEncoder.encode("Alumni@123"));
                alumniUser.setRole(Role.ALUMNI);
                alumniUser.setPhoneNumber("6666666666");
                alumniUser.setVerified(true);
                User savedAlumniUser = userRepository.save(alumniUser);

                Alumni alumni = new Alumni();
                alumni.setUser(savedAlumniUser);
                alumni.setBatchYear("2020");
                alumni.setCurrentCompany("TechCorp");
                alumni.setDomain("Software");
                alumni.setLocation("City Center");
                alumni.setIsVerified(true);
                alumni.setCreatedAt(LocalDateTime.now());
                alumni.setUpdatedAt(LocalDateTime.now());
                alumniRepository.save(alumni);
            }
        };
    }
}
