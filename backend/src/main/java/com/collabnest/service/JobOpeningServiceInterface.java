package com.collabnest.service;

import com.collabnest.model.JobOpening;
import java.util.List;
import java.util.Optional;

public interface JobOpeningServiceInterface {
    JobOpening save(JobOpening job);
JobOpening createJob(Long facultyId, JobOpening job);
JobOpening updateJob(Long jobId, Long facultyId, JobOpening updated);
void deleteJob(Long jobId, Long facultyId);
List<JobOpening> getAll();
List<JobOpening> getByFacultyId(Long facultyId);
List<JobOpening> getByAlumniId(Long alumniId);
Optional<JobOpening> getById(Long jobId);
void delete(Long jobId);
}
