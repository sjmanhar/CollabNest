package com.collabnest.controller;

import com.collabnest.model.Event;
import com.collabnest.model.User;
import com.collabnest.dto.EventDTO;
import org.modelmapper.ModelMapper;
import com.collabnest.service.EventServiceInterface;
import com.collabnest.service.UserServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/events")
public class EventController {
    @Autowired
    private EventServiceInterface eventService;
    @Autowired
    private UserServiceInterface userService;

    // Create event (faculty only)
    @PostMapping("/faculty/{facultyId}")
    public ResponseEntity<?> createEvent(@PathVariable Long facultyId, @RequestBody EventDTO eventDTO) {
        Optional<User> facultyOpt = userService.findById(facultyId);
        if (facultyOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Faculty not found");
        }
        ModelMapper modelMapper = new ModelMapper();
        Event event = modelMapper.map(eventDTO, Event.class);
        event.setFaculty(facultyOpt.get());
        event.setDateTime(event.getDateTime() == null ? LocalDateTime.now() : event.getDateTime());
        Event saved = eventService.save(event);
        EventDTO savedDTO = modelMapper.map(saved, EventDTO.class);
        savedDTO.setFacultyId(facultyId);
        return ResponseEntity.ok(savedDTO);
    }

    // Get all events (public)
    @GetMapping("")
    public List<EventDTO> getAllEvents() {
        ModelMapper modelMapper = new ModelMapper();
        List<Event> events = eventService.getAll();
        return events.stream().map(event -> {
            EventDTO dto = modelMapper.map(event, EventDTO.class);
            if (event.getFaculty() != null) dto.setFacultyId(event.getFaculty().getId());
            return dto;
        }).toList();
    }

    // Get events by faculty
    @GetMapping("/faculty/{facultyId}")
    public List<Event> getEventsByFaculty(@PathVariable Long facultyId) {
        return eventService.getByFacultyId(facultyId);
    }

    // Update event (faculty only)
    @PutMapping("/{eventId}/faculty/{facultyId}")
    public ResponseEntity<?> updateEvent(@PathVariable Long eventId, @PathVariable Long facultyId, @RequestBody Event updated) {
        try {
            Event saved = eventService.updateEvent(eventId, facultyId, updated);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    // Delete event (faculty only)
    @DeleteMapping("/{eventId}/faculty/{facultyId}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long eventId, @PathVariable Long facultyId) {
        try {
            eventService.deleteEvent(eventId, facultyId);
            return ResponseEntity.ok("Event deleted");
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }
}
