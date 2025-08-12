package com.collabnest.controller;

import com.collabnest.dto.ApiResponse;
import org.springframework.http.HttpStatus;

import com.collabnest.dto.StudentUpdateDTO;
import com.collabnest.model.Student;
import com.collabnest.model.User;
import com.collabnest.service.StudentUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/student")
public class StudentUpdateController {
    private final StudentUpdateService studentUpdateService;
    @Autowired
    public StudentUpdateController(StudentUpdateService studentUpdateService) {
        this.studentUpdateService = studentUpdateService;
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateStudent(@RequestBody StudentUpdateDTO dto) {
        try {
            Student updated = studentUpdateService.updateStudent(dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/update/by-user/{userId}")
    public ResponseEntity<?> updateStudentByUserId(@PathVariable Long userId, @RequestBody StudentUpdateDTO dto) {
        System.out.println("in update " + userId + " " + dto);
        try {
            return ResponseEntity.ok(studentUpdateService.updateDetails(userId, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(e.getMessage()));
        }
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<?> getStudentByUserId(@PathVariable Long userId) {
        Student student = studentUpdateService.getStudentByUserId(userId);
        if (student == null) {
            return ResponseEntity.badRequest().body("Student not found for userId: " + userId);
        }
        return ResponseEntity.ok(student);
    }
}
