package com.dev.caplandar.backend.rest;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.dev.caplandar.backend.entity.Blacklist;
import com.dev.caplandar.backend.entity.User;
import com.dev.caplandar.backend.service.BlacklistService;
import com.dev.caplandar.backend.service.UserService;
import com.dev.caplandar.backend.util.SendError;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class UserRestController {
    private UserService userService;
    private AuthRestController authRestController;
    private BlacklistService blacklistService;

    @Autowired
    public UserRestController(UserService userService, BlacklistService blacklistService) {
        this.userService = userService;
        this.blacklistService = blacklistService;
        this.authRestController = new AuthRestController();
    }

    @GetMapping("/users")
    public ResponseEntity<Object> getAllUsers(HttpServletResponse response, HttpServletRequest request) {
        if (authRestController.protect(response, request) != null) return null;

        String token = request.getCookies()[0].getValue();
        DecodedJWT decodedJWT = JWT.decode(token);
        String email = decodedJWT.getSubject();

        User dbUser = userService.findByEmail(email);

        if (dbUser.getId() != 20) {
            return SendError.sendUnauthorized("Only admin can get all users", response);
        }

        List<User> users = userService.findAll();

        Map<String, List<User>> responseBody = new HashMap<>();

        responseBody.put("data", users);

        return ResponseEntity.ok(responseBody);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<Object> getUserById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        if (authRestController.protect(response, request) != null) return null;

        String token = request.getCookies()[0].getValue();
        DecodedJWT decodedJWT = JWT.decode(token);
        String email = decodedJWT.getSubject();

        User dbUser = userService.findByEmail(email);

        if (dbUser.getId() != 20) {
            return SendError.sendUnauthorized("Only admin can get a user by id", response);
        }

        User user = userService.findById(id);

        if (user == null) {
            return SendError.sendNotFound("No user found with id - " + id, response);
        }

        Map<String, User> responseBody = new HashMap<>();

        responseBody.put("data", user);

        return ResponseEntity.ok(responseBody);
    }

    @GetMapping("/users/me")
    public ResponseEntity<Object> getMe(HttpServletResponse response, HttpServletRequest request) {
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

        Map<String, User> responseBody = new HashMap<>();

        responseBody.put("data", dbUser);

        return ResponseEntity.ok(responseBody);
    }

    @GetMapping("/users/search")
    public ResponseEntity<Object> searchUsers(HttpServletResponse response, HttpServletRequest request) {
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
        User admin = userService.findById(20);
        List<Blacklist> blacklists = blacklistService.findByBlacklist(dbUser);

        if (request.getParameterMap().get("usernameOrEmail") != null) {
            String usernameOrEmail = request.getParameterMap().get("usernameOrEmail")[0];
            List<User> users = userService.searchUsers(usernameOrEmail);
            users.remove(dbUser);
            users.remove(admin);

            for (int i = 0; i < blacklists.size(); i++) {
                users.remove(blacklists.get(i).getUser());
            }

            Map<String, List<User>> responseBody = new HashMap<>();
            responseBody.put("data", users);

            return ResponseEntity.ok(responseBody);
        } else {
            return SendError.sendBadRequest("Please provide username or email to search users", response);
        }
    }

    @PostMapping("/users")
    public ResponseEntity<Object> addUser(@RequestBody User user, HttpServletResponse response, HttpServletRequest request) {
        if (authRestController.protect(response, request) != null) return null;

        String token = request.getCookies()[0].getValue();
        DecodedJWT decodedJWT = JWT.decode(token);
        String email = decodedJWT.getSubject();

        User dbUser = userService.findByEmail(email);

        if (dbUser.getId() != 20) {
            return SendError.sendUnauthorized("Only admin can add a user", response);
        }

        user.setId(0);
        dbUser = userService.save(user);

        Map<String, User> responseBody = new HashMap<>();

        responseBody.put("data", dbUser);

        return ResponseEntity.ok(responseBody);
    }

    @PutMapping("/users")
    public ResponseEntity<Object> updateUser(@RequestBody User user, HttpServletResponse response, HttpServletRequest request) {
        if (authRestController.protect(response, request) != null) return null;

        String token = request.getCookies()[0].getValue();
        DecodedJWT decodedJWT = JWT.decode(token);
        String email = decodedJWT.getSubject();

        User dbUser = userService.findByEmail(email);

        if (dbUser.getId() != 20) {
            return SendError.sendUnauthorized("Only admin can modify a user", response);
        }

        dbUser = userService.save(user);

        Map<String, User> responseBody = new HashMap<>();

        responseBody.put("data", dbUser);

        return ResponseEntity.ok(responseBody);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Object> deleteUser(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
//        if (authRestController.protect(response, request) != null) return null;
//
//        String token = request.getCookies()[0].getValue();
//        DecodedJWT decodedJWT = JWT.decode(token);
//        String email = decodedJWT.getSubject();
//
//        User dbUser = userService.findByEmail(email);
//
//        if (dbUser.getId() != 20) {
//            return SendError.sendUnauthorized("Only admin can delete a user", response);
//        }

        User user = userService.findById(id);

        if (user == null) {
            return SendError.sendNotFound("No user found with id - " + id, response);
        }

        userService.deleteById(id);

        Map<String, String> responseBody = new HashMap<>();

        responseBody.put("status", "success");
        responseBody.put("message", "User who has id of " + id + " was deleted.");

        return ResponseEntity.ok(responseBody);
    }
}
