package com.collabnest.repository;

import com.collabnest.model.Alumni;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlumniRepository extends JpaRepository<Alumni, Integer> {
    Alumni findByUserId(Long userId);
}
