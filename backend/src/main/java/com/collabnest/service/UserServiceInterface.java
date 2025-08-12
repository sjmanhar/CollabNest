package com.collabnest.service;

import com.collabnest.model.User;
import java.util.Optional;

public interface UserServiceInterface {
    Optional<User> findByEmail(String email);
    Optional<User> findById(Long id);
    User registerUser(User user);
}
