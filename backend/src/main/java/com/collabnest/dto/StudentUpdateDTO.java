package com.collabnest.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentUpdateDTO {
    private Long userId;
    private Integer studentId;
    // User table fields
    private String name;
    private String email;  

    // Student fields

    private String branch;
    private String year;
    private String resumeUrl;


    private String phoneNumber;
}
