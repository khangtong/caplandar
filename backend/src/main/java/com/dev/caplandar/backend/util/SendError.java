package com.dev.caplandar.backend.util;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;

import java.io.IOException;

public class SendError {
    public static ResponseEntity<Object> sendNotFound(String msg, HttpServletResponse response) {
        try {
            response.sendError(404, msg);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return ResponseEntity.notFound().build();
    }

    public static ResponseEntity<Object> sendBadRequest(String msg, HttpServletResponse response) {
        try {
            response.sendError(400, msg);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return ResponseEntity.badRequest().build();
    }

    public static ResponseEntity<Object> sendUnauthorized(String msg, HttpServletResponse response) {
        try {
            response.sendError(401, msg);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return ResponseEntity.badRequest().build();
    }
}
