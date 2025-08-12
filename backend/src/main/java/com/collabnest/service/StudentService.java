package com.collabnest.service;

import com.collabnest.model.Student;
import com.collabnest.model.User;
import com.collabnest.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import org.modelmapper.ModelMapper;
import com.collabnest.dto.StudentRegistrationDTO;

@Service
public class StudentService implements StudentServiceInterface {
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ModelMapper modelMapper;

    public Student save(Student student) {
        return studentRepository.save(student);
    }

    public Optional<Student> findById(Long id) {
        if (id == null) return Optional.empty();
        return studentRepository.findById(id.intValue());
    }

    @Override
    public Student mapRegistrationDtoToEntity(StudentRegistrationDTO dto) {
        return modelMapper.map(dto, Student.class);
    }

    public Object registerStudent(StudentRegistrationDTO student, UserService userService) {
        if (student.getEmail() == null || student.getPassword() == null || student.getConfirmPassword() == null) {
            return "Missing required fields";
        }
        if (!student.getPassword().equals(student.getConfirmPassword())) {
            return "Passwords do not match";
        }
        java.util.Optional<User> existing = userService.findByEmail(student.getEmail());
        if (existing.isPresent()) {
            return "Email already registered";
        }
        // Save user fields
        User user = new User();
        user.setName(student.getName());
        user.setEmail(student.getEmail());
        user.setPassword(student.getPassword());
        user.setRole(com.collabnest.model.Role.STUDENT);
        user.setVerified(true);
        User savedUser = userService.registerUser(user);
        // Save student fields
        Student studentEntity = new Student();
        studentEntity.setUser(savedUser);
        studentEntity.setPrn(student.getPrn());
        studentEntity.setBranch(student.getBranch());
        studentEntity.setImgUrl(null); // handle image upload separately
        studentEntity.setResumeUrl(null); // handle resume upload separately
        // studentEntity.setLocation(student.getLocation()); // No location field in Student entity
        studentEntity.setIsVerifiedAlumni(false);
        // Optionally set rollNo, year, createdAt, updatedAt if present in DTO
        Student savedStudent = save(studentEntity);
        return savedStudent;
    }
}
