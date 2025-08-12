package com.collabnest.model;

import jakarta.persistence.*;
import com.collabnest.model.Event;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "payments")
public class Payments {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer paymentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String paymentStatus;
    private String paymentGatewayTxnId;
    private LocalDateTime paymentDate;
    private Double amount;
    private String razorpayOrderId;
    private String currency;
}
