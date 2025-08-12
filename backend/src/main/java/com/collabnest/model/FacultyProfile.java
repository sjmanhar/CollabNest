package com.collabnest.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "faculty_profiles")
public class FacultyProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;
    private String name;
    private String department;
    private String location;
    private String email;
    private LocalDate dob;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] image;


}
