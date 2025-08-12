package com.collabnest.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
        String msg = ex.getMessage();
        // Customize status code based on message
        if (msg != null) {
            if (msg.contains("Already applied")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(msg); // 409
            }
            if (msg.contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(msg); // 404
            }
            if (msg.contains("not authorized") || msg.contains("forbidden")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(msg); // 403
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(msg != null ? msg : "Unexpected error");
    }
    // Add more handlers as needed
}
