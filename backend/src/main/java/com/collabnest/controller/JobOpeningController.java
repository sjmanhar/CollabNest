package com.collabnest.controller;

import com.collabnest.model.JobOpening;
import com.collabnest.dto.JobOpeningDTO;
import org.modelmapper.ModelMapper;
import com.collabnest.model.User;
import com.collabnest.service.JobOpeningServiceInterface;
import com.collabnest.service.UserServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/jobs")
public class JobOpeningController {
    @Autowired
    private JobOpeningServiceInterface jobOpeningService;
    @Autowired
    private UserServiceInterface userService;

    @Autowired
    private ModelMapper modelMapper;

    // Create job opening (faculty only)
    @PostMapping("/faculty/{facultyId}")
    public ResponseEntity<?> createJob(@PathVariable Long facultyId, @RequestBody JobOpeningDTO jobDTO) {
        try {
            JobOpening job = modelMapper.map(jobDTO, JobOpening.class);
            JobOpening saved = jobOpeningService.createJob(facultyId, job);
            return ResponseEntity.ok(modelMapper.map(saved, JobOpeningDTO.class));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get all job openings (public)
    @GetMapping("")
    public List<JobOpeningDTO> getAllJobs() {
        return jobOpeningService.getAll().stream()
            .map(job -> modelMapper.map(job, JobOpeningDTO.class))
            .toList();
    }

    // Get job openings by faculty
    @GetMapping("/faculty/{facultyId}")
    public List<JobOpeningDTO> getJobsByFaculty(@PathVariable Long facultyId) {
        return jobOpeningService.getByFacultyId(facultyId).stream()
            .map(job -> modelMapper.map(job, JobOpeningDTO.class))
            .toList();
    }

    // Update job opening (faculty only)
    @PutMapping("/{jobId}/faculty/{facultyId}")
    public ResponseEntity<?> updateJob(@PathVariable Long jobId, @PathVariable Long facultyId, @RequestBody JobOpeningDTO updatedDTO) {
        try {
            JobOpening updated = modelMapper.map(updatedDTO, JobOpening.class);
            JobOpening saved = jobOpeningService.updateJob(jobId, facultyId, updated);
            return ResponseEntity.ok(modelMapper.map(saved, JobOpeningDTO.class));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    // Delete job opening (faculty only)
    @DeleteMapping("/{jobId}/faculty/{facultyId}")
    public ResponseEntity<?> deleteJob(@PathVariable Long jobId, @PathVariable Long facultyId) {
        try {
            jobOpeningService.deleteJob(jobId, facultyId);
            return ResponseEntity.ok("Job deleted");
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    // Create job opening (alumni only)
    @PostMapping("/alumni/{alumniId}")
    public ResponseEntity<?> createJobByAlumni(@PathVariable Long alumniId, @RequestBody JobOpeningDTO jobDTO) {
        try {
            JobOpening job = modelMapper.map(jobDTO, JobOpening.class);
            // Set alumni
            User alumni = userService.findById(alumniId).orElseThrow(() -> new RuntimeException("Alumni not found"));
            job.setAlumni(alumni);
            job.setCreatedAt(java.time.LocalDateTime.now());
            JobOpening saved = jobOpeningService.save(job);
            return ResponseEntity.ok(modelMapper.map(saved, JobOpeningDTO.class));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get job openings by alumni
    @GetMapping("/alumni/{alumniId}")
    public List<JobOpeningDTO> getJobsByAlumni(@PathVariable Long alumniId) {
        return jobOpeningService.getByAlumniId(alumniId).stream()
            .map(job -> modelMapper.map(job, JobOpeningDTO.class))
            .toList();
    }
}
