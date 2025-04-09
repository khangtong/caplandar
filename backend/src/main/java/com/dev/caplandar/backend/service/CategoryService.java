package com.dev.caplandar.backend.service;

import com.dev.caplandar.backend.entity.Category;
import com.dev.caplandar.backend.entity.User;

import java.util.List;

public interface CategoryService {
    List<Category> findAll();

    List<Category> findByUser(User user);

    Category findById(int id);

    Category save(Category category);

    void deleteById(int id);
}
