package com.collabnest.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AlumniRegistrationDTO {
    private String name;
    private String email;
    private String password;
    private String confirmPassword;
    private String phoneNumber;
    private String prn;
    private String certificateId;
    private String domain;
    private String batchYear;
    private String currentCompany;
    private String location;


}
