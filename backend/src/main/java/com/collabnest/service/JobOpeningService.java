package com.collabnest.service;

import com.collabnest.model.JobOpening;
import com.collabnest.dto.JobOpeningDTO;
import org.modelmapper.ModelMapper;
import com.collabnest.model.User;
import com.collabnest.repository.JobOpeningRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import org.modelmapper.ModelMapper;

@Service
public class JobOpeningService implements JobOpeningServiceInterface {
    private final JobOpeningRepository jobOpeningRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private UserService userService;

    @Autowired
    public JobOpeningService(JobOpeningRepository jobOpeningRepository) {
        this.jobOpeningRepository = jobOpeningRepository;
    }

    public JobOpening save(JobOpening job) {
        return jobOpeningRepository.save(job);
    }

    public JobOpening createJob(Long facultyId, JobOpening job) {
        Optional<User> facultyOpt = userService.findById(facultyId);
        if (facultyOpt.isEmpty()) {
            throw new RuntimeException("Faculty not found");
        }
        job.setFaculty(facultyOpt.get());
        job.setCreatedAt(java.time.LocalDateTime.now());
        return save(job);
    }

    public JobOpening updateJob(Long jobId, Long facultyId, JobOpening updated) {
        Optional<JobOpening> jobOpt = getById(jobId);
        if (jobOpt.isEmpty() || !jobOpt.get().getFaculty().getId().equals(facultyId)) {
            throw new RuntimeException("Not authorized or job not found");
        }
        JobOpening job = jobOpt.get();
        job.setTitle(updated.getTitle());
        job.setDescription(updated.getDescription());
        job.setLocation(updated.getLocation());
        job.setCompany(updated.getCompany());
        job.setSalary(updated.getSalary());
        return save(job);
    }

    public void deleteJob(Long jobId, Long facultyId) {
        Optional<JobOpening> jobOpt = getById(jobId);
        if (jobOpt.isEmpty() || !jobOpt.get().getFaculty().getId().equals(facultyId)) {
            throw new RuntimeException("Not authorized or job not found");
        }
        delete(jobId);
    }

    public List<JobOpening> getAll() {
        return jobOpeningRepository.findAll();
    }

    public List<JobOpening> getByFacultyId(Long facultyId) {
        return jobOpeningRepository.findByFacultyId(facultyId);
    }

    public List<JobOpening> getByAlumniId(Long alumniId) {
        return jobOpeningRepository.findByAlumniId(alumniId);
    }

    public Optional<JobOpening> getById(Long jobId) {
        return jobOpeningRepository.findById(jobId);
    }

    public void delete(Long jobId) {
        jobOpeningRepository.deleteById(jobId);
    }
}
