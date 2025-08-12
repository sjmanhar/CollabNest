package com.collabnest.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "alumni")
public class Alumni {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer alumniId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    private String certificateId;
    private String prn;
    private String domain;
    private String currentCompany;
    private String location;
    private String batchYear;
    private String imgUrl;
    private Boolean isVerified;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
