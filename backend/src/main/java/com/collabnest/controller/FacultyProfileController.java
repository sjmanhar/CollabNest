package com.collabnest.controller;

import com.collabnest.model.Faculty;
import com.collabnest.model.FacultyProfile;
import com.collabnest.model.FacultyProfileDTO;
import com.collabnest.service.FacultyProfileServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/faculty/profile")
public class FacultyProfileController {
    @Autowired
    private FacultyProfileServiceInterface facultyProfileService;
    @Autowired
    private com.collabnest.repository.FacultyRepository facultyRepository;

    // Get profile by userId
    @GetMapping("/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable Long userId) {
        Optional<FacultyProfile> profileOpt = facultyProfileService.getProfileByUserId(userId);
        if (profileOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        FacultyProfile profile = profileOpt.get();
        FacultyProfileDTO dto = new FacultyProfileDTO();
        dto.setId(profile.getId());
        dto.setName(profile.getName());
        dto.setDepartment(profile.getDepartment());
        dto.setLocation(profile.getLocation());
        dto.setEmail(profile.getEmail());
        dto.setDob(profile.getDob());
        // Map contact (phone number) from User
        if (profile.getUser() != null) {
            dto.setContact(profile.getUser().getPhoneNumber());
        }
        // Map facultyId from Faculty
        Faculty faculty = null;
        try {
            faculty = facultyRepository.findByUserId(userId);
        } catch (Exception ignored) {}
        if (faculty != null) {
            dto.setFacultyId(faculty.getFacultyId());
        }
        return ResponseEntity.ok(dto);
    }

    // Update profile (excluding image)
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateProfile(@PathVariable Long userId, @RequestBody FacultyProfile updated) {
        try {
            FacultyProfile profile = facultyProfileService.updateProfile(userId, updated);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Upload/Update profile image (max 2MB, JPEG/PNG only)
    @PostMapping("/{userId}/image")
    public ResponseEntity<?> uploadProfileImage(@PathVariable Long userId, @RequestParam("image") MultipartFile file) throws IOException {
        if (file.getSize() > 2 * 1024 * 1024) {
            return ResponseEntity.badRequest().body("Image size must be <= 2MB");
        }
        String contentType = file.getContentType();
        if (!MediaType.IMAGE_JPEG_VALUE.equals(contentType) && !MediaType.IMAGE_PNG_VALUE.equals(contentType)) {
            return ResponseEntity.badRequest().body("Only JPEG or PNG images are allowed");
        }
        try {
            facultyProfileService.uploadProfileImage(userId, file.getBytes(), contentType);
            return ResponseEntity.ok("Image uploaded successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Download profile image
    @GetMapping("/{userId}/image")
    public ResponseEntity<?> getProfileImage(@PathVariable Long userId) {
        try {
            byte[] img = facultyProfileService.getProfileImage(userId);
            String contentType = MediaType.IMAGE_JPEG_VALUE;
            if (img.length > 8 && img[0] == (byte)0x89 && img[1] == (byte)0x50) {
                contentType = MediaType.IMAGE_PNG_VALUE;
            }
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, contentType)
                    .body(img);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
