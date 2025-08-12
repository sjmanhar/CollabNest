package com.collabnest.controller;

import com.collabnest.dto.CreateOrderDto;
import com.collabnest.dto.PaymentVerificationDto;
import com.collabnest.service.PaymentService;
import com.razorpay.RazorpayException;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderDto dto) {
        System.out.println("[PaymentController] Received createOrder request: " + dto);
        try {
            JSONObject order = paymentService.createOrder(dto);
            System.out.println("[PaymentController] Order created successfully: " + order.toString());
            return ResponseEntity.ok()
                    .body(new CreateOrderResponse(
                            order.getString("id"),
                            order.getLong("amount"),
                            order.getString("currency"),
                            paymentService.getRazorpayKeyId()
                    ));
        } catch (RazorpayException e) {
            System.err.println("[PaymentController] Error creating order: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error creating order: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("[PaymentController] Unexpected error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Unexpected error: " + e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerificationDto dto) {
        boolean success = paymentService.verifyPayment(dto);
        if (success) {
            return ResponseEntity.ok("{\"status\":\"success\"}");
        } else {
            return ResponseEntity.badRequest().body("{\"status\":\"failure\"}");
        }
    }

    @Getter
    @AllArgsConstructor
    static class CreateOrderResponse {
        private String orderId;
        private Long amount;
        private String currency;
        private String key;
    }
}
