package com.collabnest.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AlumniUpdateDTO {
    private Long userId;
    private Integer alumniId;
    // User table fields
    private String name;
    private String email;

    // Alumni fields


    private String domain;
    private String currentCompany;
    private String location;
    private String batchYear;


    private String phoneNumber;
}
