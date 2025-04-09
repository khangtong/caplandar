package com.dev.caplandar.backend.rest;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.dev.caplandar.backend.entity.Category;
import com.dev.caplandar.backend.entity.User;
import com.dev.caplandar.backend.service.EmailService;
import com.dev.caplandar.backend.service.TemplateService;
import com.dev.caplandar.backend.service.UserService;
import com.dev.caplandar.backend.util.JwtTokenProvider;
import com.dev.caplandar.backend.util.SendError;
import com.google.gson.Gson;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.*;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class AuthRestController {
    private UserService userService;
    private EmailService emailService;
    private JwtTokenProvider jwtTokenProvider;
    private TemplateService templateService;
    private PasswordEncoder passwordEncoder;

    @Autowired
    public AuthRestController(UserService userService, EmailService emailService, TemplateService templateService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.emailService = emailService;
        this.templateService = templateService;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = new JwtTokenProvider();
    }

    public AuthRestController() {
        this.jwtTokenProvider = new JwtTokenProvider();
    }

    public ResponseEntity<Object> createAndSendToken(User user, HttpServletResponse response) {
        String token = jwtTokenProvider.generateToken(user);
        response.setHeader("Authorization", "Bearer " + token);

        int maxAge = 60 * 60 * 24 * 3; // 30 days in seconds

        Cookie cookie = new Cookie("userAuthToken", token);
        cookie.setPath("/");
        cookie.setMaxAge(maxAge);
        cookie.setSecure(true);
        cookie.setHttpOnly(true);

        response.addCookie(cookie);
        response.setStatus(201);

        Gson gson = new Gson();
        String userJson = gson.toJson(user);

        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("token", token);
        responseBody.put("status", "success");
        responseBody.put("data", userJson);

        return ResponseEntity.ok(responseBody);
    }

    @PostMapping("/users/signup")
    public ResponseEntity<Object> signup(@RequestBody User user, HttpServletResponse response) {
        User dbUser = userService.findByEmail(user.getEmail());

        if (dbUser != null) {
            return SendError.sendBadRequest("The user with this email already exists", response);
        }

        try {
            user.setId(0);

            // HASH PASSWORD
            String encodedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(encodedPassword);

            dbUser = userService.save(user);
            emailService.sendVerifyEmail(dbUser);
        } catch (IOException | MessagingException e) {
            throw new RuntimeException(e);
        }

        Map<String, String> responseBody = new HashMap<>();

        responseBody.put("message", "Your account is waiting for verification");

        return ResponseEntity.ok(responseBody);
    }

    @PostMapping("/users/signin")
    public ResponseEntity<Object> signin(@RequestBody User user, HttpServletResponse response) {
        User dbUser = userService.findByEmail(user.getEmail());

        if (dbUser == null || !passwordEncoder.matches(user.getPassword(), dbUser.getPassword())) {
            return SendError.sendBadRequest("Email or password is not correct", response);
        }

        if (!dbUser.isVerified()) {
            return SendError.sendBadRequest("Your account is not verified, please verify your account", response);
        }

        return createAndSendToken(dbUser, response);
    }

    @GetMapping("/users/logout")
    public ResponseEntity<Object> logout(HttpServletResponse response, HttpServletRequest request) {
        if (protect(response, request) != null) return null;

        response.reset();
        response.setHeader("jwt", "");

        Cookie cookie = new Cookie("userAuthToken", "");
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setSecure(true);
        cookie.setHttpOnly(true);

        response.addCookie(cookie);

        return ResponseEntity.ok().build();
    }

    public ResponseEntity<Object> protect(HttpServletResponse response, HttpServletRequest request) {
        String token = new String("");

        if (request.getHeader("Authorization") != null && request.getHeader("Authorization").startsWith("Bearer")) {
            token = request.getHeader("Authorization").split(" ")[1];
        } else if (request.getCookies() != null && request.getCookies().length > 0) {
            token = request.getCookies()[0].getValue();
        }

        if (token.equals("")) {
            return SendError.sendUnauthorized("Please log in to access!", response);
        }

        if (!jwtTokenProvider.verifyToken(token)) {
            return SendError.sendBadRequest("Your token is not valid!", response);
        }

        return null;
    }

    @PatchMapping("/users/change-password")
    public ResponseEntity<Object> changePassword(@RequestBody User user, HttpServletResponse response, HttpServletRequest request) {
        if (protect(response, request) != null) return null;

        String token = new String("");

        if (request.getHeader("Authorization") != null && request.getHeader("Authorization").startsWith("Bearer")) {
            token = request.getHeader("Authorization").split(" ")[1];
        } else if (request.getCookies() != null && request.getCookies().length > 0) {
            token = request.getCookies()[0].getValue();
        }

        DecodedJWT decodedJWT = JWT.decode(token);
        String email = decodedJWT.getSubject();

        User dbUser = userService.findByEmail(email);

        if (dbUser == null) {
            return SendError.sendNotFound("There is no user with email - " + user.getEmail(), response);
        }

        if (!user.getCurrentPassword().equals(dbUser.getPassword())) {
            return SendError.sendBadRequest("Password is not correct", response);
        }

        if (!user.getNewPassword().equals(user.getConfirmPassword())) {
            return SendError.sendBadRequest("Your new password and the confirmed password are not the same", response);
        }

        dbUser.setPassword(user.getNewPassword());
        userService.save(dbUser);

        return createAndSendToken(dbUser, response);
    }

    @PatchMapping("/users/me")
    public ResponseEntity<Object> updateMe(@RequestBody User user, HttpServletResponse response, HttpServletRequest request) {
        if (protect(response, request) != null) return null;

        String token = new String("");

        if (request.getHeader("Authorization") != null && request.getHeader("Authorization").startsWith("Bearer")) {
            token = request.getHeader("Authorization").split(" ")[1];
        } else if (request.getCookies() != null && request.getCookies().length > 0) {
            token = request.getCookies()[0].getValue();
        }

        DecodedJWT decodedJWT = JWT.decode(token);
        String email = decodedJWT.getSubject();

        User dbUser = userService.findByEmail(email);

        if (dbUser == null) {
            return SendError.sendNotFound("There is no user with email - " + user.getEmail(), response);
        }

        dbUser.setUsername(user.getUsername());

        List<User> users = userService.findAll();
        for (int i = 0; i < users.size(); i++) {
            if (users.get(i).getEmail().equals(user.getEmail()) && !user.getEmail().equals(dbUser.getEmail()))
                return SendError.sendBadRequest("The user with this email already exists", response);
        }

        dbUser.setEmail(user.getEmail());
        dbUser.setAvatar(user.getAvatar());

        userService.save(dbUser);

        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("status", "success");
        responseBody.put("message", "Your profile is updated successfully");

        return ResponseEntity.ok(responseBody);
    }
}
