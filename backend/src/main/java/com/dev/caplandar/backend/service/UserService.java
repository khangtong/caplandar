package com.dev.caplandar.backend.service;

import com.dev.caplandar.backend.entity.User;

import java.util.List;

public interface UserService {
    List<User> findAll();

    User findById(int id);

    User findByEmail(String email);

    List<User> searchUsers(String usernameOrEmail);

    User save(User user);

    void deleteById(int id);
}
