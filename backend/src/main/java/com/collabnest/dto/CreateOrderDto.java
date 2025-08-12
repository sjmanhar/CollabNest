package com.collabnest.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderDto {
    private Double amount;  
    private Integer eventId;
    private Integer userId;  // Single userId instead of studentId or alumniId
}

