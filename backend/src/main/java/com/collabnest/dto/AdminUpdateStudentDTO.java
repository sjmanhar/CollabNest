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
public class AdminUpdateStudentDTO {
    @NotNull
    private Long userId;
    private String email;
    private Integer studentId;
    private String name;
    private String password;
    private String prn;
}
