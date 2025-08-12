package com.collabnest.controller;

import com.collabnest.dto.ApiResponse;
import org.springframework.http.HttpStatus;

import com.collabnest.dto.AlumniUpdateDTO;
import com.collabnest.model.Alumni;
import com.collabnest.model.User;
import com.collabnest.service.AlumniUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/alumni")
public class AlumniUpdateController {
    private final AlumniUpdateService alumniUpdateService;
    @Autowired
    public AlumniUpdateController(AlumniUpdateService alumniUpdateService) {
        this.alumniUpdateService = alumniUpdateService;
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateAlumni(@RequestBody AlumniUpdateDTO dto) {
        try {
            Alumni updated = alumniUpdateService.updateAlumni(dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/update/by-user/{userId}")
    public ResponseEntity<?> updateAlumniByUserId(@PathVariable Long userId, @RequestBody AlumniUpdateDTO dto) {
        System.out.println("in update " + userId + " " + dto);
        try {
            return ResponseEntity.ok(alumniUpdateService.updateDetails(userId, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(e.getMessage()));
        }
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<?> getAlumniByUserId(@PathVariable Long userId) {
        Alumni alumni = alumniUpdateService.getAlumniByUserId(userId);
        if (alumni == null) {
            return ResponseEntity.badRequest().body("Alumni not found for userId: " + userId);
        }
        return ResponseEntity.ok(alumni);
    }
}
