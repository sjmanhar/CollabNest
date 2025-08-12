package com.collabnest.dto;

import jakarta.validation.constraints.NotNull;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminUpdateFacultyDTO {
    @NotNull
    private Long userId;
    private String email;
    private Integer facultyId;
    private String name;
    private String password;
    private String department;
}
