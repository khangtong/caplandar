package com.dev.caplandar.backend.dao;

import com.dev.caplandar.backend.entity.Schedule;
import com.dev.caplandar.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Integer>{
    User findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.username LIKE %?1% OR u.email LIKE %?1%")
    List<User> searchUsers(String usernameOrEmail);
}
