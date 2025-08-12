package com.collabnest.dto;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReferralDTO {
    private AlumniSummaryDTO alumni; // summary info for UI
    private Integer referralId;
    private String title;
    private String company;
    private String referralLink;
    private String description;
    private String location;
    private Boolean isActive;
    private Integer alumniId;
    private LocalDate createdAt;
}
