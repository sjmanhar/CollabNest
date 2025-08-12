package com.collabnest.repository;

import com.collabnest.model.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FacultyRepository extends JpaRepository<Faculty, Integer> {
    Faculty findByUserId(Long userId);
}
