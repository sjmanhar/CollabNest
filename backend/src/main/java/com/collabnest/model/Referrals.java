package com.collabnest.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "referrals")
public class Referrals {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer referralId;

    private String title;
    private String company;
    private String referralLink;
    private String description;
    private String location;
    private Boolean isActive;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "alumni_id")
    private Alumni alumni;

    private LocalDate createdAt;
}
