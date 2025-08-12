package com.collabnest.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String message;
    private String token;
    private String name;
    private String email;
    private String role;
    private Long userId; // Added to support numeric user id in login response


}
