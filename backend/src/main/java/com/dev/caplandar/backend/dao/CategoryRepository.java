package com.dev.caplandar.backend.dao;

import com.dev.caplandar.backend.entity.Category;
import com.dev.caplandar.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    List<Category> findByUser(User user);
}
