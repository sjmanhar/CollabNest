package com.collabnest.controller;

import com.collabnest.dto.ReferralDTO;
import com.collabnest.service.ReferralService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/referrals")
public class ReferralController {
    @Autowired
    private ReferralService referralService;

    // Alumni can add referral
    @PostMapping("/alumni/{alumniId}")
    public ResponseEntity<ReferralDTO> addReferral(@PathVariable Integer alumniId, @RequestBody ReferralDTO dto) {
        return ResponseEntity.ok(referralService.addReferral(alumniId, dto));
    }

    // Alumni can update referral
    @PutMapping("/{referralId}/alumni/{alumniId}")
    public ResponseEntity<ReferralDTO> updateReferral(@PathVariable Integer referralId, @PathVariable Integer alumniId, @RequestBody ReferralDTO dto) {
        return ResponseEntity.ok(referralService.updateReferral(referralId, alumniId, dto));
    }

    // Alumni can delete referral
    @DeleteMapping("/{referralId}/alumni/{alumniId}")
    public ResponseEntity<?> deleteReferral(@PathVariable Integer referralId, @PathVariable Integer alumniId) {
        referralService.deleteReferral(referralId, alumniId);
        return ResponseEntity.ok().build();
    }

    // Alumni can read their own referrals
    @GetMapping("/alumni/{alumniId}")
    public ResponseEntity<List<ReferralDTO>> getReferralsByAlumni(@PathVariable Integer alumniId) {
        return ResponseEntity.ok(referralService.getReferralsByAlumni(alumniId));
    }

    // Students can read all active referrals
    @GetMapping("/active")
    public ResponseEntity<List<ReferralDTO>> getAllActiveReferrals() {
        return ResponseEntity.ok(referralService.getAllActiveReferrals());
    }

    // Students can apply for a referral
    @PostMapping("/{referralId}/apply/{studentId}")
    public ResponseEntity<?> applyForReferral(@PathVariable Integer referralId, @PathVariable Integer studentId) {
        referralService.applyForReferral(referralId, studentId);
        return ResponseEntity.ok().build();
    }

    // Students can read their applied referrals
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<ReferralDTO>> getReferralsForStudent(@PathVariable Integer studentId) {
        return ResponseEntity.ok(referralService.getReferralsForStudent(studentId));
    }
}
