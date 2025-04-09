package com.dev.caplandar.backend.rest;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.dev.caplandar.backend.entity.Category;
import com.dev.caplandar.backend.entity.Schedule;
import com.dev.caplandar.backend.entity.User;
import com.dev.caplandar.backend.service.CategoryService;
import com.dev.caplandar.backend.service.UserService;
import com.dev.caplandar.backend.util.SendError;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class CategoryRestController {
    private CategoryService categoryService;

    private AuthRestController authRestController;

    private UserService userService;

    @Autowired
    public CategoryRestController(CategoryService categoryService, UserService userService) {
        this.categoryService = categoryService;
        this.userService = userService;
        this.authRestController = new AuthRestController();
    }

    @GetMapping("/categories")
    public ResponseEntity<Object> getAllCategories(HttpServletResponse response, HttpServletRequest request) {
        if (authRestController.protect(response, request) != null) return null;

        String token = new String("");

        if (request.getHeader("Authorization") != null && request.getHeader("Authorization").startsWith("Bearer")) {
            token = request.getHeader("Authorization").split(" ")[1];
        } else if (request.getCookies() != null && request.getCookies().length > 0) {
            token = request.getCookies()[0].getValue();
        }

        DecodedJWT decodedJWT = JWT.decode(token);
        String email = decodedJWT.getSubject();

        User dbUser = userService.findByEmail(email);

        List<Category> userCategories = categoryService.findByUser(dbUser);

        if (userCategories == null || userCategories.isEmpty()) {
            return SendError.sendNotFound("There is no category found", response);
        }

        Map<String, List<Category>> responseBody = new HashMap<>();

        responseBody.put("data", userCategories);

        return ResponseEntity.ok(responseBody);
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<Object> getCategoryById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        if (authRestController.protect(response, request) != null) return null;

        Category category = categoryService.findById(id);

        if (category == null) return SendError.sendNotFound("There is no category with id - " + id, response);

        Map<String, Category> responseBody = new HashMap<>();

        responseBody.put("data", category);

        return ResponseEntity.ok(responseBody);
    }

    @PostMapping("/categories")
    public ResponseEntity<Object> addCategory(@RequestBody Category category, HttpServletResponse response, HttpServletRequest request) {
        if (authRestController.protect(response, request) != null) return null;

        category.setId(0);

        String token = new String("");

        if (request.getHeader("Authorization") != null && request.getHeader("Authorization").startsWith("Bearer")) {
            token = request.getHeader("Authorization").split(" ")[1];
        } else if (request.getCookies() != null && request.getCookies().length > 0) {
            token = request.getCookies()[0].getValue();
        }

        DecodedJWT decodedJWT = JWT.decode(token);
        String email = decodedJWT.getSubject();

        User dbUser = userService.findByEmail(email);
        List<Category> userCategories = categoryService.findByUser(dbUser);

        for (int i = 0; i < userCategories.size(); i++) {
            if (userCategories.get(i).getName().equalsIgnoreCase(category.getName())) {
                return SendError.sendBadRequest("There is a category which has the same name, please try another name", response);
            }
        }

        category.setUser(dbUser);

        Category dbCategory = categoryService.save(category);

        Map<String, Category> responseBody = new HashMap<>();

        responseBody.put("data", dbCategory);

        return ResponseEntity.ok(responseBody);
    }

    @PutMapping("/categories")
    public ResponseEntity<Object> updateCategory(@RequestBody Category category, HttpServletResponse response, HttpServletRequest request) {
        if (authRestController.protect(response, request) != null) return null;

        String token = new String("");

        if (request.getHeader("Authorization") != null && request.getHeader("Authorization").startsWith("Bearer")) {
            token = request.getHeader("Authorization").split(" ")[1];
        } else if (request.getCookies() != null && request.getCookies().length > 0) {
            token = request.getCookies()[0].getValue();
        }

        DecodedJWT decodedJWT = JWT.decode(token);
        String email = decodedJWT.getSubject();

        User dbUser = userService.findByEmail(email);

        Category oldCategory = categoryService.findById(category.getId());

        if (!oldCategory.getUser().equals(dbUser))
            return SendError.sendBadRequest("You are not allowed to modify this category", response);

        category.setUser(dbUser);

        Category dbCategory = categoryService.save(category);

        Map<String, Category> responseBody = new HashMap<>();

        responseBody.put("data", dbCategory);

        return ResponseEntity.ok(responseBody);
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Object> deleteCategory(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        if (authRestController.protect(response, request) != null) return null;

        Category category = categoryService.findById(id);

        if (category == null) {
            return SendError.sendNotFound("There is no category with id - " + id, response);
        }

        String token = new String("");

        if (request.getHeader("Authorization") != null && request.getHeader("Authorization").startsWith("Bearer")) {
            token = request.getHeader("Authorization").split(" ")[1];
        } else if (request.getCookies() != null && request.getCookies().length > 0) {
            token = request.getCookies()[0].getValue();
        }

        DecodedJWT decodedJWT = JWT.decode(token);
        String email = decodedJWT.getSubject();

        User dbUser = userService.findByEmail(email);

        if (!category.getUser().equals(dbUser))
            return SendError.sendBadRequest("You are not allowed to delete this category", response);

        categoryService.deleteById(id);

        Map<String, String> responseBody = new HashMap<>();

        responseBody.put("status", "success");
        responseBody.put("message", "Category was deleted");

        return ResponseEntity.ok(responseBody);
    }
}
