package com.collabnest.service;

import com.collabnest.model.FacultyProfile;
import com.collabnest.repository.FacultyProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import org.modelmapper.ModelMapper;

@Service
public class FacultyProfileService implements FacultyProfileServiceInterface {
    @Autowired
    private FacultyProfileRepository facultyProfileRepository;

    @Autowired
    private ModelMapper modelMapper;

    public Optional<FacultyProfile> getProfileByUserId(Long userId) {
        return facultyProfileRepository.findByUserId(userId);
    }

    public FacultyProfile saveProfile(FacultyProfile profile) {
        return facultyProfileRepository.save(profile);
    }

    public FacultyProfile updateProfile(Long userId, FacultyProfile updated) {
        Optional<FacultyProfile> profileOpt = getProfileByUserId(userId);
        if (profileOpt.isEmpty()) {
            throw new RuntimeException("Profile not found");
        }
        FacultyProfile profile = profileOpt.get();
        profile.setName(updated.getName());
        profile.setDepartment(updated.getDepartment());
        profile.setLocation(updated.getLocation());
        profile.setEmail(updated.getEmail());

        profile.setDob(updated.getDob());
        return saveProfile(profile);
    }

    public FacultyProfile uploadProfileImage(Long userId, byte[] image, String contentType) {
        Optional<FacultyProfile> profileOpt = getProfileByUserId(userId);
        if (profileOpt.isEmpty()) {
            throw new RuntimeException("Profile not found");
        }
        FacultyProfile profile = profileOpt.get();
        profile.setImage(image);
        return saveProfile(profile);
    }

    public byte[] getProfileImage(Long userId) {
        Optional<FacultyProfile> profileOpt = getProfileByUserId(userId);
        if (profileOpt.isEmpty() || profileOpt.get().getImage() == null) {
            throw new RuntimeException("Image not found");
        }
        return profileOpt.get().getImage();
    }

    public void deleteProfile(Long id) {
        facultyProfileRepository.deleteById(id);
    }
}
