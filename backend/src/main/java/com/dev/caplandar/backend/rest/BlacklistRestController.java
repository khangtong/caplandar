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
public class BlacklistRestController {
    private BlacklistService blacklistService;
    private UserService userService;
    private AuthRestController authRestController;

    @Autowired
    public BlacklistRestController(BlacklistService blacklistService, UserService userService) {
        this.blacklistService = blacklistService;
        this.userService = userService;
        this.authRestController = new AuthRestController();
    }

    @GetMapping("/blacklists")
    public ResponseEntity<Object> getAllBlacklists(HttpServletResponse response, HttpServletRequest request) {
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
        List<Blacklist> blacklists;

        if (dbUser.getId() == 20) {
            blacklists = blacklistService.findAll();
        } else {
            blacklists = blacklistService.findByUser(dbUser);
        }

        if (blacklists == null || blacklists.isEmpty()) {
            return SendError.sendNotFound("There is no blacklist found", response);
        }

        Map<String, List<Blacklist>> responseBody = new HashMap<>();

        responseBody.put("data", blacklists);

        return ResponseEntity.ok(responseBody);
    }

    @PostMapping("/blacklists")
    public ResponseEntity<Object> addBlacklist(HttpServletResponse response, HttpServletRequest request) {
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
        User blockedUser = userService.findById(Integer.parseInt(request.getParameterMap().get("blockedUser")[0]));

        if (admin.equals(blockedUser)) {
            return SendError.sendBadRequest("You can not add admin to your blacklist", response);
        }

        if (dbUser.equals(blockedUser)) {
            return SendError.sendBadRequest("You can not add yourself to your blacklist", response);
        }

        List<Blacklist> blacklists = blacklistService.findByUser(dbUser);
        for (int i = 0; i < blacklists.size(); i++) {
            if (blacklists.get(i).getBlacklist().equals(blockedUser)) {
                return SendError.sendBadRequest("You can only add once per user", response);
            }
        }

        Blacklist blacklist = new Blacklist(0, dbUser, blockedUser);

        Blacklist dbBlacklist = blacklistService.save(blacklist);

        Map<String, Blacklist> responseBody = new HashMap<>();

        responseBody.put("data", dbBlacklist);

        return ResponseEntity.ok(responseBody);
    }

    @DeleteMapping("/blacklists/{id}")
    public ResponseEntity<Object> deleteBlacklist(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
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
        List<Blacklist> blacklists = blacklistService.findByUser(dbUser);
        Blacklist dbBlacklist = blacklistService.findById(id);

        if (!blacklists.contains(dbBlacklist)) {
            return SendError.sendNotFound("There is no blacklist to delete", response);
        }

        blacklistService.deleteById(id);

        Map<String, String> responseBody = new HashMap<>();

        responseBody.put("status", "success");
        responseBody.put("message", "Blacklist which has id of " + id + " was deleted.");

        return ResponseEntity.ok(responseBody);
    }
}
