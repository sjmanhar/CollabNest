package com.collabnest.service;

import com.collabnest.dto.FacultyUpdateDTO;
import com.collabnest.model.Faculty;
import com.collabnest.model.User;
import com.collabnest.repository.FacultyRepository;
import com.collabnest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class FacultyUpdateService {
    private final FacultyRepository facultyRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public FacultyUpdateService(FacultyRepository facultyRepository, UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.facultyRepository = facultyRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Faculty updateFaculty(FacultyUpdateDTO dto) {
        Faculty faculty = null;
        if (dto.getUserId() != null) {
            faculty = facultyRepository.findByUserId(dto.getUserId());
        } else if (dto.getFacultyId() != null) {
            Optional<Faculty> facultyOpt = facultyRepository.findById(dto.getFacultyId());
            if (facultyOpt.isPresent()) {
                faculty = facultyOpt.get();
            }
        }
        if (faculty == null) throw new RuntimeException("Faculty not found");
        User user = faculty.getUser();
        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        // No password in FacultyUpdateDTO
        if (dto.getDepartment() != null) faculty.setDepartment(dto.getDepartment());
        if (dto.getLocation() != null) faculty.setLocation(dto.getLocation());
        if (dto.getPhoneNumber() != null) user.setPhoneNumber(dto.getPhoneNumber());
        userRepository.save(user);
        return facultyRepository.save(faculty);
    }

    public Faculty updateFacultyByUserId(Long userId, FacultyUpdateDTO dto) {
        Faculty faculty = facultyRepository.findByUserId(userId);
        if (faculty == null) throw new RuntimeException("Faculty not found for userId: " + userId);
        User user = faculty.getUser();
        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        if (dto.getDepartment() != null) faculty.setDepartment(dto.getDepartment());
        if (dto.getLocation() != null) faculty.setLocation(dto.getLocation());
        if (dto.getPhoneNumber() != null) user.setPhoneNumber(dto.getPhoneNumber());
        userRepository.save(user);
        return facultyRepository.save(faculty);
    }

    public com.collabnest.dto.ApiResponse updateDetails(Long userId, FacultyUpdateDTO dto) {
        Faculty faculty = facultyRepository.findByUserId(userId);
        if (faculty == null) throw new RuntimeException("Faculty not found for userId: " + userId);
        User user = faculty.getUser();
        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        if (dto.getDepartment() != null) faculty.setDepartment(dto.getDepartment());
        if (dto.getPhoneNumber() != null) user.setPhoneNumber(dto.getPhoneNumber());
        userRepository.save(user);
        facultyRepository.save(faculty);
        return new com.collabnest.dto.ApiResponse("Updated faculty details.");
    }

    public Faculty getFacultyByUserId(Long userId) {
        return facultyRepository.findByUserId(userId);
    }
}
