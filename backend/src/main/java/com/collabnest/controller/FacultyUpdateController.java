package com.collabnest.controller;

import com.collabnest.dto.ApiResponse;
import org.springframework.http.HttpStatus;

import com.collabnest.dto.FacultyUpdateDTO;
import com.collabnest.model.Faculty;
import com.collabnest.model.User;
import com.collabnest.service.FacultyUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/faculty")
public class FacultyUpdateController {
    private final FacultyUpdateService facultyUpdateService;
    @Autowired
    public FacultyUpdateController(FacultyUpdateService facultyUpdateService) {
        this.facultyUpdateService = facultyUpdateService;
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateFaculty(@RequestBody FacultyUpdateDTO dto) {
        try {
            Faculty updated = facultyUpdateService.updateFaculty(dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/update/by-user/{userId}")
    public ResponseEntity<?> updateFacultyByUserId(@PathVariable Long userId, @RequestBody FacultyUpdateDTO dto) {
        System.out.println("in update " + userId + " " + dto);
        try {
            return ResponseEntity.ok(facultyUpdateService.updateDetails(userId, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(e.getMessage()));
        }
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<?> getFacultyByUserId(@PathVariable Long userId) {
        Faculty faculty = facultyUpdateService.getFacultyByUserId(userId);
        if (faculty == null) {
            return ResponseEntity.badRequest().body("Faculty not found for userId: " + userId);
        }
        return ResponseEntity.ok(faculty);
    }
}
