package com.collabnest.repository;

import com.collabnest.model.JobOpening;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobOpeningRepository extends JpaRepository<JobOpening, Long> {
    List<JobOpening> findByFacultyId(Long facultyId);
    List<JobOpening> findByAlumniId(Long alumniId);
}
