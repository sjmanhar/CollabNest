package com.collabnest.controller;

import com.collabnest.dto.ReferralApplicationDTO;
import com.collabnest.service.ReferralApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/referral-applications")
@RequiredArgsConstructor
public class ReferralApplicationController {
    private final ReferralApplicationService applicationService;

    // Student applies for referral
    @PostMapping("/apply/{referralId}/{studentId}")
    public ResponseEntity<ReferralApplicationDTO> apply(@PathVariable Integer referralId, @PathVariable Integer studentId) {
        return ResponseEntity.ok(applicationService.applyForReferral(referralId, studentId));
    }

    // Alumni gets all applicants for a referral
    @GetMapping("/referral/{referralId}/applicants")
    public ResponseEntity<List<ReferralApplicationDTO>> getApplicants(@PathVariable Integer referralId) {
        return ResponseEntity.ok(applicationService.getApplicantsByReferral(referralId));
    }

    // Student gets all their applications
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<ReferralApplicationDTO>> getStudentApplications(@PathVariable Integer studentId) {
        return ResponseEntity.ok(applicationService.getApplicationsByStudent(studentId));
    }

    // Alumni approves one applicant (others get rejected)
    @PostMapping("/approve/{applicationId}")
    public ResponseEntity<Void> approve(@PathVariable Integer applicationId) {
        applicationService.approveApplicant(applicationId);
        return ResponseEntity.ok().build();
    }
}
