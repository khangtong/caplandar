package com.dev.caplandar.backend.rest;

import com.dev.caplandar.backend.entity.Guest;
import com.dev.caplandar.backend.entity.Schedule;
import com.dev.caplandar.backend.entity.Token;
import com.dev.caplandar.backend.entity.User;
import com.dev.caplandar.backend.service.*;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Optional;

@Controller
@CrossOrigin
@RequestMapping("/api")
public class ActionController {
    private TokenService tokenService;
    private ScheduleService scheduleService;
    private UserService userService;
    private GuestService guestService;
    private EmailService emailService;

    @Autowired
    public ActionController(TokenService tokenService, ScheduleService scheduleService, UserService userService, GuestService guestService, EmailService emailService) {
        this.tokenService = tokenService;
        this.scheduleService = scheduleService;
        this.userService = userService;
        this.guestService = guestService;
        this.emailService = emailService;
    }

    @GetMapping("/action")
    public String handleAction(@RequestParam String token, HttpServletRequest request) {
        if (tokenService.validateToken(token)) {
            Optional<Token> dbTokenOpt = tokenService.getToken(token);

            if ("VERIFY_ACCOUNT".equals(dbTokenOpt.get().getActionType())) {
                User user = dbTokenOpt.get().getUser();
                user.setVerified(true);
                userService.save(user);

                // Send welcome email
                try {
                    emailService.sendWelcomeEmail(user);
                } catch (MessagingException e) {
                    throw new RuntimeException(e);
                }
            }

            if ("ACCEPT_INVITE".equals(dbTokenOpt.get().getActionType())) {
                int schedule = Integer.parseInt(request.getParameterMap().get("schedule")[0]);
                int guest = Integer.parseInt(request.getParameterMap().get("guest")[0]);

                Schedule schedule1 = scheduleService.findById(schedule);
                User guest1 = userService.findById(guest);
                guestService.save(new Guest(0, schedule1, guest1));
            }

            tokenService.invalidateToken(token);
            return "action-success";
        } else {
            return "action-error";
        }
    }
}
