package com.collabnest.service;

import com.collabnest.dto.ReferralDTO;
import java.util.List;

public interface ReferralService {
    ReferralDTO addReferral(Integer alumniId, ReferralDTO dto);
    ReferralDTO updateReferral(Integer referralId, Integer alumniId, ReferralDTO dto);
    void deleteReferral(Integer referralId, Integer alumniId);
    List<ReferralDTO> getReferralsByAlumni(Integer alumniId);
    List<ReferralDTO> getAllReferrals();
    List<ReferralDTO> getAllActiveReferrals();
    // For students to apply
    void applyForReferral(Integer referralId, Integer studentId);
    // For students to read
    List<ReferralDTO> getReferralsForStudent(Integer studentId);
}
