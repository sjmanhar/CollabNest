package com.collabnest.dto;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventDTO {
    private Long id;
    private String name;
    private String poster;
    private LocalDateTime dateTime;
    private String location;
    private String description;
    private Double price;
    private String audience;
    private Long facultyId;
}
