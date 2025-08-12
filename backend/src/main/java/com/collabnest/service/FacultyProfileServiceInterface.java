package com.collabnest.service;

import com.collabnest.model.FacultyProfile;
import java.util.Optional;

public interface FacultyProfileServiceInterface {
    Optional<FacultyProfile> getProfileByUserId(Long userId);
    FacultyProfile saveProfile(FacultyProfile profile);
    FacultyProfile updateProfile(Long userId, FacultyProfile updated);
    FacultyProfile uploadProfileImage(Long userId, byte[] image, String contentType);
    byte[] getProfileImage(Long userId);
    void deleteProfile(Long id);
}
