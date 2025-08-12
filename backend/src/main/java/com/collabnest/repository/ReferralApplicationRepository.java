package com.collabnest.repository;

import com.collabnest.model.ReferralApplication;
import com.collabnest.model.ReferralApplication.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.List;

@Repository
public interface ReferralApplicationRepository extends JpaRepository<ReferralApplication, Integer> {
    @EntityGraph(attributePaths = {"student.user"})
    List<ReferralApplication> findByReferral_ReferralId(Integer referralId);
    List<ReferralApplication> findByAlumni_AlumniId(Integer alumniId);
    @EntityGraph(attributePaths = {"student.user"})
    List<ReferralApplication> findByStudent_StudentId(Integer studentId);
    List<ReferralApplication> findByReferral_ReferralIdAndStatus(Integer referralId, ApplicationStatus status);
}
