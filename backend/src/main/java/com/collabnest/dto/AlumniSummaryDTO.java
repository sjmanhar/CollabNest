package com.collabnest.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlumniSummaryDTO {
    private Integer alumniId;
    private String name;
    private String image;
    private String expertise;
    private String location;
    private String company;
}
