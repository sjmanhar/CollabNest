package com.collabnest.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FacultyUpdateDTO {
    private Long userId;
    private Integer facultyId;
    // User table fields
    private String name;
    private String email;

    // Faculty fields
    private String department;
    private String location;
    private String phoneNumber;
}
