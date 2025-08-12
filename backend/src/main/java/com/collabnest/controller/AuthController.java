package com.collabnest.controller;

import com.collabnest.model.User;
import com.collabnest.model.FacultyProfile;
import com.collabnest.service.AuthServiceInterface;
import com.collabnest.service.UserServiceInterface;
import com.collabnest.service.FacultyProfileServiceInterface;
import com.collabnest.dto.StudentRegistrationDTO;
import com.collabnest.dto.AlumniRegistrationDTO;
import com.collabnest.dto.FacultyRegistrationDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final com.collabnest.security.JwtUtils jwtUtils;
    private final AuthServiceInterface authService;
    private final UserServiceInterface userService;
    private final FacultyProfileServiceInterface facultyProfileService;

    @Autowired
    public AuthController(AuthServiceInterface authService, UserServiceInterface userService, FacultyProfileServiceInterface facultyProfileService, com.collabnest.security.JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
        this.authService = authService;
        this.userService = userService;
        this.facultyProfileService = facultyProfileService;
    }

    // Student Registration

    @PostMapping("/register/student")
    public ResponseEntity<?> registerStudent(@RequestBody StudentRegistrationDTO student) {
        Object result = authService.registerStudent(student);
        if (result instanceof String) {
            return ResponseEntity.badRequest().body(result);
        }
        return ResponseEntity.ok(result);
    }

    // Alumni Registration
    @PostMapping("/register/alumni")
    public ResponseEntity<?> registerAlumni(@RequestBody AlumniRegistrationDTO alumni) {
        Object result = authService.registerAlumni(alumni);
        if (result instanceof String) {
            return ResponseEntity.badRequest().body(result);
        }
        return ResponseEntity.ok(result);
    }

    // Faculty Registration (admin only)
    @PostMapping("/register/faculty")
    public ResponseEntity<?> registerFaculty(@RequestBody FacultyRegistrationDTO faculty) {
        Object result = authService.registerFaculty(faculty);
        if (result instanceof String) {
            return ResponseEntity.badRequest().body(result);
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody com.collabnest.dto.UserSignInRequest loginRequest, org.springframework.security.core.Authentication authentication) {
        Object result = authService.login(loginRequest.getEmail(), loginRequest.getPassword());
        if (result instanceof String) {
            return ResponseEntity.status(401).body(result);
        }
        // Successful login
        com.collabnest.model.User user = (com.collabnest.model.User) result;
        // Wrap user in CustomUserDetails for JWT
        com.collabnest.security.CustomUserDetails userDetails = new com.collabnest.security.CustomUserDetails(user);
        String jwt = jwtUtils.generateJwtToken(
            new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities()
            )
        );
        com.collabnest.dto.AuthResponse response = new com.collabnest.dto.AuthResponse(
            "Login successful",
            jwt,
            user.getName(),
            user.getEmail(),
            user.getRole().name(),
            user.getId()
        );
        return ResponseEntity.ok(response);
    }
}
