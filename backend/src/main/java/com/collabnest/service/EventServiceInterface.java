package com.collabnest.service;

import com.collabnest.model.Event;
import java.util.List;
import java.util.Optional;

public interface EventServiceInterface {
    Event save(Event event);
    Event save(com.collabnest.dto.EventDTO eventDTO, com.collabnest.model.User faculty);
    List<Event> getAll();
    java.util.List<com.collabnest.dto.EventDTO> getAllDTOs();
    Optional<Event> getById(Long eventId);
    void delete(Long eventId);
    Event updateEvent(Long eventId, Long facultyId, Event updated);
    void deleteEvent(Long eventId, Long facultyId);
    List<Event> getByFacultyId(Long facultyId);
    java.util.List<com.collabnest.dto.EventDTO> getByFacultyIdDTO(Long facultyId);
}
