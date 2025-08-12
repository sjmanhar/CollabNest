package com.collabnest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class CollabnestApplication {
    public static void main(String[] args) {
        SpringApplication.run(CollabnestApplication.class, args);
    }

    @Bean
    public ModelMapper modelMapper() {
        System.out.println("creating model mapper");
        ModelMapper modelMapper = new ModelMapper();
        // Skip alumniId when mapping AlumniRegistrationDTO to Alumni if needed
        modelMapper.typeMap(com.collabnest.dto.AlumniRegistrationDTO.class, com.collabnest.model.Alumni.class)
            .addMappings(mapper -> mapper.skip(com.collabnest.model.Alumni::setAlumniId));
        return modelMapper;
    }
}
