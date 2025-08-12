package com.collabnest.service;

import com.collabnest.dto.ReferralApplicationDTO;
import java.util.List;

public interface ReferralApplicationService {
    ReferralApplicationDTO applyForReferral(Integer referralId, Integer studentId);
    List<ReferralApplicationDTO> getApplicantsByReferral(Integer referralId);
    List<ReferralApplicationDTO> getApplicationsByStudent(Integer studentId);
    void approveApplicant(Integer applicationId);
}
