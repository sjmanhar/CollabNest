package com.collabnest.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer studentId;

    private String rollNo;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    private String prn;
    private String branch;
    private String year;
    private String resumeUrl;
    private String imgUrl;
    private Boolean isVerifiedAlumni;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
