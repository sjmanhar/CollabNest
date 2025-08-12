package com.collabnest.service;

import com.collabnest.model.Event;

import com.collabnest.dto.CreateOrderDto;
import com.collabnest.dto.PaymentVerificationDto;
import com.collabnest.model.Payments;
import com.collabnest.model.User;
import com.collabnest.repository.EventRepository;
import com.collabnest.repository.PaymentsRepository;
import com.collabnest.repository.UserRepository;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final RazorpayService razorpayService;
    private final PaymentsRepository paymentsRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public JSONObject createOrder(CreateOrderDto dto) throws RazorpayException {
        long amountInPaise = (long)(dto.getAmount() * 100);
        String receipt = "evt_" + dto.getEventId() + "_user_" + dto.getUserId() + "_" + System.currentTimeMillis();

        JSONObject order = razorpayService.createOrder(amountInPaise, receipt);

        Optional<Event> eventOpt = eventRepository.findById(dto.getEventId().longValue());
        Optional<User> userOpt = userRepository.findById(dto.getUserId().longValue());

        Payments payment = new Payments();
        payment.setRazorpayOrderId(order.getString("id"));
        payment.setAmount(dto.getAmount());
        payment.setCurrency("INR");
        payment.setPaymentStatus("pending");
        payment.setPaymentDate(LocalDateTime.now());

        eventOpt.ifPresent(payment::setEvent);
        userOpt.ifPresent(payment::setUser);

        paymentsRepository.save(payment);

        return order;
    }

    public boolean verifyPayment(PaymentVerificationDto dto) {
        boolean valid = razorpayService.verifySignature(dto.getRazorpay_order_id(), dto.getRazorpay_payment_id(), dto.getRazorpay_signature());
        if (!valid) return false;

        Optional<Payments> paymentOpt = paymentsRepository.findByRazorpayOrderId(dto.getRazorpay_order_id());
        if (paymentOpt.isEmpty()) return false;

        Payments payment = paymentOpt.get();
        payment.setPaymentGatewayTxnId(dto.getRazorpay_payment_id());
        payment.setPaymentStatus("success");
        payment.setPaymentDate(LocalDateTime.now());

        paymentsRepository.save(payment);

        return true;
    }

    public String getRazorpayKeyId() {
        return razorpayService.getKeyId();
    }
}
