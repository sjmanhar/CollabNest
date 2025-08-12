package com.collabnest.repository;

import com.collabnest.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByFacultyId(Long facultyId);
}
