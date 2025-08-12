package com.collabnest.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReferralApplicationDTO {
    private Integer applicationId;
    private Integer referralId;
    private Integer alumniId;
    private Integer studentId;
    private String status; // PENDING, APPROVED, REJECTED
    private String name; // applicant name
    private String email; // applicant email
}
