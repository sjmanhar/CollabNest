package com.collabnest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobOpeningDTO {
    private Long id;
    private String title;
    private String description;
    private String location;
    private String company;
    private Double salary;
    private String eligibility;
    private LocalDateTime createdAt;
    private Long facultyId;
}
