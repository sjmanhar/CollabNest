package com.collabnest.service;

import com.collabnest.dto.AlumniUpdateDTO;
import com.collabnest.model.Alumni;
import com.collabnest.model.User;
import com.collabnest.repository.AlumniRepository;
import com.collabnest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AlumniUpdateService {
    private final AlumniRepository alumniRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public AlumniUpdateService(AlumniRepository alumniRepository, UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.alumniRepository = alumniRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Alumni updateAlumni(AlumniUpdateDTO dto) {
        Alumni alumni = null;
        if (dto.getUserId() != null) {
            alumni = alumniRepository.findByUserId(dto.getUserId());
        } else if (dto.getAlumniId() != null) {
            Optional<Alumni> alumniOpt = alumniRepository.findById(dto.getAlumniId());
            if (alumniOpt.isPresent()) {
                alumni = alumniOpt.get();
            }
        }
        if (alumni == null) throw new RuntimeException("Alumni not found");
        User user = alumni.getUser();
        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        // No password, prn, or certificateId in AlumniUpdateDTO
        if (dto.getDomain() != null) alumni.setDomain(dto.getDomain());
        if (dto.getCurrentCompany() != null) alumni.setCurrentCompany(dto.getCurrentCompany());
        if (dto.getLocation() != null) alumni.setLocation(dto.getLocation());
        if (dto.getBatchYear() != null) alumni.setBatchYear(dto.getBatchYear());

        if (dto.getPhoneNumber() != null) user.setPhoneNumber(dto.getPhoneNumber());
        userRepository.save(user);
        return alumniRepository.save(alumni);
    }

    public com.collabnest.dto.ApiResponse updateDetails(Long userId, AlumniUpdateDTO dto) {
        Alumni alumni = alumniRepository.findByUserId(userId);
        if (alumni == null) throw new RuntimeException("Alumni not found for userId: " + userId);
        User user = alumni.getUser();
        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        if (dto.getDomain() != null) alumni.setDomain(dto.getDomain());
        if (dto.getCurrentCompany() != null) alumni.setCurrentCompany(dto.getCurrentCompany());
        if (dto.getLocation() != null) alumni.setLocation(dto.getLocation());
        if (dto.getBatchYear() != null) alumni.setBatchYear(dto.getBatchYear());
        if (dto.getPhoneNumber() != null) user.setPhoneNumber(dto.getPhoneNumber());
        userRepository.save(user);
        alumniRepository.save(alumni);
        return new com.collabnest.dto.ApiResponse("Updated alumni details.");
    }

    public Alumni getAlumniByUserId(Long userId) {
        return alumniRepository.findByUserId(userId);
    }
}
