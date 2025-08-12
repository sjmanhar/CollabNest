package com.collabnest.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentVerificationDto {
    private String razorpay_order_id;
    private String razorpay_payment_id;
    private String razorpay_signature;
}