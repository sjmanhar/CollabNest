package com.collabnest.repository;

import com.collabnest.model.FacultyProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FacultyProfileRepository extends JpaRepository<FacultyProfile, Long> {
    Optional<FacultyProfile> findByUserId(Long userId);
}
