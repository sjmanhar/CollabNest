package com.collabnest.controller;

import com.collabnest.dto.AdminUpdateStudentDTO;
import com.collabnest.dto.AdminUpdateAlumniDTO;
import com.collabnest.dto.AdminUpdateFacultyDTO;
import com.collabnest.model.Student;
import com.collabnest.model.Alumni;
import com.collabnest.model.Faculty;
import com.collabnest.service.AdminServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private AdminServiceInterface adminService; // Use interface for flexibility

    // Student CRUD
    @PostMapping("/student")
    public ResponseEntity<?> createStudent(@RequestBody AdminUpdateStudentDTO dto) {
        try {
            Student created = adminService.createStudent(dto);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/student/{userId}")
    public ResponseEntity<?> updateStudent(@PathVariable Long userId, @RequestBody AdminUpdateStudentDTO dto) {
        try {
            dto.setUserId(userId);
            Student updated = adminService.updateStudentByUserId(dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/student/{userId}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long userId) {
        try {
            adminService.deleteStudentByUserId(userId);
            return ResponseEntity.ok("Student deleted");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/student/{userId}")
    public ResponseEntity<?> getStudent(@PathVariable Long userId) {
        try {
            Student student = adminService.getStudentByUserId(userId);
            return ResponseEntity.ok(student);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/students")
    public ResponseEntity<?> getAllStudents() {
        return ResponseEntity.ok(adminService.getAllStudents());
    }

    // Alumni CRUD
    @PostMapping("/alumni")
    public ResponseEntity<?> createAlumni(@RequestBody AdminUpdateAlumniDTO dto) {
        try {
            Alumni created = adminService.createAlumni(dto);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/alumni/{userId}")
    public ResponseEntity<?> updateAlumni(@PathVariable Long userId, @RequestBody AdminUpdateAlumniDTO dto) {
        try {
            dto.setUserId(userId);
            Alumni updated = adminService.updateAlumniByUserId(dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/alumni/{userId}")
    public ResponseEntity<?> deleteAlumni(@PathVariable Long userId) {
        try {
            adminService.deleteAlumniByUserId(userId);
            return ResponseEntity.ok("Alumni deleted");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/alumni/{userId}")
    public ResponseEntity<?> getAlumni(@PathVariable Long userId) {
        try {
            Alumni alumni = adminService.getAlumniByUserId(userId);
            return ResponseEntity.ok(alumni);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/alumnis")
    public ResponseEntity<?> getAllAlumni() {
        return ResponseEntity.ok(adminService.getAllAlumni());
    }

    // Faculty CRUD
    @PostMapping("/faculty")
    public ResponseEntity<?> createFaculty(@RequestBody AdminUpdateFacultyDTO dto) {
        try {
            Faculty created = adminService.createFaculty(dto);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/faculty/{userId}")
    public ResponseEntity<?> updateFaculty(@PathVariable Long userId, @RequestBody AdminUpdateFacultyDTO dto) {
        try {
            dto.setUserId(userId);
            Faculty updated = adminService.updateFacultyByUserId(dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/faculty/{userId}")
    public ResponseEntity<?> deleteFaculty(@PathVariable Long userId) {
        try {
            adminService.deleteFacultyByUserId(userId);
            return ResponseEntity.ok("Faculty deleted");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/faculty/{userId}")
    public ResponseEntity<?> getFaculty(@PathVariable Long userId) {
        try {
            Faculty faculty = adminService.getFacultyByUserId(userId);
            return ResponseEntity.ok(faculty);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/faculties")
    public ResponseEntity<?> getAllFaculty() {
        return ResponseEntity.ok(adminService.getAllFaculty());
    }
}
