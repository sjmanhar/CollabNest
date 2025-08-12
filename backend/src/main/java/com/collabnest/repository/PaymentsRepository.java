package com.collabnest.repository;

import com.collabnest.model.Payments;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentsRepository extends JpaRepository<Payments, Integer> {
    Optional<Payments> findByRazorpayOrderId(String razorpayOrderId);
}
