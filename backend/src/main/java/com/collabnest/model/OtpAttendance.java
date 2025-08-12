package com.collabnest.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "otp_attendance")
public class OtpAttendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer otpId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    private String otpCode;
    private LocalDateTime generatedAt;
    private Boolean isActive;
}
