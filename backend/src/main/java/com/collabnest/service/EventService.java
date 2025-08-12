package com.collabnest.service;

import com.collabnest.model.Event;
import com.collabnest.repository.EventRepository;
import com.collabnest.dto.EventDTO;
import com.collabnest.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class EventService implements EventServiceInterface {
    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private ModelMapper modelMapper;

    public Event save(Event event) {
        return eventRepository.save(event);
    }

    public Event save(EventDTO eventDTO, User faculty) {
        // Use the injected ModelMapper bean

        Event event = modelMapper.map(eventDTO, Event.class);
        event.setFaculty(faculty);
        return eventRepository.save(event);
    }

    public Event updateEvent(Long eventId, Long facultyId, Event updated) {
        // Optionally, add a DTO-based update method if needed
    
        Optional<Event> eventOpt = getById(eventId);
        if (eventOpt.isEmpty() || !eventOpt.get().getFaculty().getId().equals(facultyId)) {
            throw new RuntimeException("Not authorized or event not found");
        }
        Event event = eventOpt.get();
        event.setName(updated.getName());
        event.setPoster(updated.getPoster());
        event.setDateTime(updated.getDateTime());
        event.setLocation(updated.getLocation());
        event.setDescription(updated.getDescription());
        event.setPrice(updated.getPrice());
        event.setAudience(updated.getAudience());
        return eventRepository.save(event);
    }

    public void deleteEvent(Long eventId, Long facultyId) {
        Optional<Event> eventOpt = getById(eventId);
        if (eventOpt.isEmpty() || !eventOpt.get().getFaculty().getId().equals(facultyId)) {
            throw new RuntimeException("Not authorized or event not found");
        }
        eventRepository.deleteById(eventId);
    }

    public List<Event> getAll() {
        return eventRepository.findAll();
    }

    public List<EventDTO> getAllDTOs() {
        // Use the injected ModelMapper bean

        List<Event> events = eventRepository.findAll();
        return events.stream().map(event -> {
            EventDTO dto = modelMapper.map(event, EventDTO.class);
            if (event.getFaculty() != null) dto.setFacultyId(event.getFaculty().getId());
            return dto;
        }).toList();
    }

    public List<Event> getByFacultyId(Long facultyId) {
        return eventRepository.findByFacultyId(facultyId);
    }

    public List<EventDTO> getByFacultyIdDTO(Long facultyId) {
        // Use the injected ModelMapper bean

        List<Event> events = eventRepository.findByFacultyId(facultyId);
        return events.stream().map(event -> {
            EventDTO dto = modelMapper.map(event, EventDTO.class);
            if (event.getFaculty() != null) dto.setFacultyId(event.getFaculty().getId());
            return dto;
        }).toList();
    }

    public Optional<Event> getById(Long id) {
        return eventRepository.findById(id);
    }

    public void delete(Long id) {
        eventRepository.deleteById(id);
    }
}
