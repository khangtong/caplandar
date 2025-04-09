package com.dev.caplandar.backend.rest;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.dev.caplandar.backend.entity.*;
import com.dev.caplandar.backend.service.*;
import com.dev.caplandar.backend.util.SendError;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class ScheduleRestController {
    private ScheduleService scheduleService;
    private AuthRestController authRestController;
    private UserService userService;
    private CategoryService categoryService;
    private GuestService guestService;
    private BlacklistService blacklistService;
    private EmailService emailService;

    @Autowired
    public ScheduleRestController(ScheduleService scheduleService, UserService userService, CategoryService categoryService, GuestService guestService, BlacklistService blacklistService, EmailService emailService) {
        this.scheduleService = scheduleService;
        this.userService = userService;
        this.categoryService = categoryService;
        this.guestService = guestService;
        this.blacklistService = blacklistService;
        this.emailService = emailService;
        this.authRestController = new AuthRestController();
    }

    @GetMapping("/schedules")
    public ResponseEntity<Object> getAllSchedules(HttpServletResponse response, HttpServletRequest request) {
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

        List<Schedule> schedules;

//        Get all schedules if the logged-in user is admin
        if (dbUser.getId() == 20) {
            schedules = scheduleService.findAll();
        } else {
            schedules = scheduleService.findByUser(dbUser);
        }

        if (schedules == null || schedules.isEmpty()) {
            return SendError.sendNotFound("There is no schedule found", response);
        }

        Map<String, List<Schedule>> responseBody = new HashMap<>();

        responseBody.put("data", schedules);

        return ResponseEntity.ok(responseBody);
    }

    @GetMapping("/schedules/{id}")
    public ResponseEntity<Object> getScheduleById(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        if (authRestController.protect(response, request) != null) return null;

        Schedule schedule = scheduleService.findById(id);

        if (schedule == null) {
            return SendError.sendNotFound("There is no schedule with id - " + id, response);
        }

        List<Guest> guests = guestService.findBySchedule(schedule);

        if (!guests.isEmpty()) {
            List<String> guestEmails = new ArrayList<>();

            for (int j = 0; j < guests.size(); j++) {
                guestEmails.add(guests.get(j).getUser().getEmail());
            }

            schedule.setGuests(guestEmails.toString());
        }

        Map<String, Schedule> responseBody = new HashMap<>();

        responseBody.put("data", schedule);

        return ResponseEntity.ok(responseBody);
    }

    @GetMapping("/search")
    public ResponseEntity<Object> searchSchedules(HttpServletResponse response, HttpServletRequest request) {
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

        List<Schedule> results = scheduleService.findByUser(dbUser);
        int conditionCount = 0;

        if (request.getParameterMap().get("title") != null) {
            conditionCount++;
            String title = request.getParameterMap().get("title")[0].toLowerCase();

            for (int i = results.size() - 1; i >= 0; i--) {
                Schedule schedule = results.get(i);
                if (!schedule.getTitle().toLowerCase().contains(title)) {
                    results.remove(i);
                }
            }
        }

        if (request.getParameterMap().get("year") != null) {
            conditionCount++;
            String year = request.getParameterMap().get("year")[0];

            for (int i = results.size() - 1; i >= 0; i--) {
                Schedule schedule = results.get(i);
                String yearS = schedule.getDate().toString().split("-")[0];
                if (!yearS.equals(year)) results.remove(i);
            }
        }

        if (request.getParameterMap().get("month") != null) {
            conditionCount++;
            String month = request.getParameterMap().get("month")[0];

            for (int i = results.size() - 1; i >= 0; i--) {
                Schedule schedule = results.get(i);
                String monthS = schedule.getDate().toString().split("-")[1];
                if (!monthS.equals(month)) results.remove(i);
            }
        }

        if (request.getParameterMap().get("date") != null) {
            conditionCount++;
            String date = request.getParameterMap().get("date")[0];

            for (int i = results.size() - 1; i >= 0; i--) {
                Schedule schedule = results.get(i);
                String dateS = schedule.getDate().toString().split("-")[2];
                if (!dateS.equals(date)) results.remove(i);
            }
        }

        if (request.getParameterMap().get("location") != null) {
            conditionCount++;
            String location = request.getParameterMap().get("location")[0].toLowerCase();

            for (int i = results.size() - 1; i >= 0; i--) {
                Schedule schedule = results.get(i);
                if (!schedule.getLocation().toLowerCase().contains(location)) results.remove(i);
            }
        }

        if (request.getParameterMap().get("category") != null) {
            conditionCount++;
            int categoryID = Integer.parseInt(request.getParameterMap().get("category")[0]);
            Category category = categoryService.findById(categoryID);

            for (int i = results.size() - 1; i >= 0; i--) {
                Schedule schedule = results.get(i);
                if (!schedule.getCategory().equals(category)) results.remove(i);
            }
        }

        if (conditionCount == 0) {
            return SendError.sendBadRequest("Select one of the conditions to search schedules", response);
        }

        Map<String, List<Schedule>> responseBody = new HashMap<>();

        responseBody.put("data", results);

        return ResponseEntity.ok(responseBody);
    }

    @PostMapping("/schedules")
    public ResponseEntity<Object> addSchedule(@RequestBody Schedule schedule, HttpServletResponse response, HttpServletRequest request) {
        if (authRestController.protect(response, request) != null) return null;

        schedule.setId(0);

//        Add user to schedule for creating foreign key
        String token = new String("");

        if (request.getHeader("Authorization") != null && request.getHeader("Authorization").startsWith("Bearer")) {
            token = request.getHeader("Authorization").split(" ")[1];
        } else if (request.getCookies() != null && request.getCookies().length > 0) {
            token = request.getCookies()[0].getValue();
        }

        DecodedJWT decodedJWT = JWT.decode(token);
        String email = decodedJWT.getSubject();

        User dbUser = userService.findByEmail(email);
        schedule.setUser(dbUser);

        Category category = categoryService.findById(schedule.getCategory().getId());
        if (category == null) {
            return SendError.sendBadRequest("Category not found", response);
        }

        List<Blacklist> blacklists = blacklistService.findByBlacklist(dbUser);
        List<Blacklist> blockedUsers = blacklistService.findByUser(dbUser);

//        Add guests to schedule
        List<User> guests = new ArrayList<>();
        if (schedule.getGuests() != null && !schedule.getGuests().equals("")) {
            List<String> guestEmails = List.of(schedule.getGuests().split(", "));

            for (int i = 0; i < guestEmails.size(); i++) {
                for (int j = 0; j < guestEmails.size(); j++) {
                    if (guestEmails.get(i).equals(guestEmails.get(j)) && i != j) {
                        return SendError.sendBadRequest("You can invite only once for each user", response);
                    }
                }
            }

            if (guestEmails.contains(dbUser.getEmail())) {
                return SendError.sendBadRequest("Cannot invite yourself to your schedule", response);
            } else {
                for (int i = 0; i < guestEmails.size(); i++) {
                    User user = userService.findByEmail(guestEmails.get(i));
                    if (user == null) {
                        return SendError.sendBadRequest("There is no user who has email - " + guestEmails.get(i), response);
                    }
                    guests.add(user);
                }
            }

            for (int i = 0; i < blacklists.size(); i++) {
                if (guestEmails.contains(blacklists.get(i).getUser().getEmail())) {
                    return SendError.sendBadRequest("Cannot invite the user who has email: " + blacklists.get(i).getUser().getEmail() + " because you are blocked by this user.", response);
                }
            }

            for (int i = 0; i < blockedUsers.size(); i++) {
                if (guestEmails.contains(blockedUsers.get(i).getBlacklist().getEmail())) {
                    return SendError.sendBadRequest("Cannot invite the user who has email: " + blockedUsers.get(i).getBlacklist().getEmail() + " because you blocked this user.", response);
                }
            }

            schedule.setGuests(schedule.getGuests());
        }

        scheduleService.save(schedule);

        for (int i = 0; i < guests.size(); i++) {
            try {
                emailService.sendInviteEmail(dbUser, guests.get(i), schedule);
            } catch (UnsupportedEncodingException e) {
                throw new RuntimeException(e);
            } catch (MessagingException e) {
                throw new RuntimeException(e);
            }
        }

        Map<String, Schedule> responseBody = new HashMap<>();

        responseBody.put("data", schedule);

        return ResponseEntity.ok(responseBody);
    }

    @PutMapping("/schedules")
    public ResponseEntity<Object> updateSchedule(@RequestBody Schedule schedule, HttpServletResponse response, HttpServletRequest request) {
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

        Schedule dbSchedule = scheduleService.findById(schedule.getId());

        if (dbSchedule != null && !dbSchedule.getUser().equals(dbUser)) {
            return SendError.sendBadRequest("You are not allowed to modify this schedule", response);
        }

        schedule.setUser(dbUser);

//        Update guests to schedule
        List<User> guests = new ArrayList<>();
        if (schedule.getGuests() != null && !schedule.getGuests().equals("")) {
            List<String> guestEmails = List.of(schedule.getGuests().split(", "));

            for (int i = 0; i < guestEmails.size(); i++) {
                for (int j = 0; j < guestEmails.size(); j++) {
                    if (guestEmails.get(i).equals(guestEmails.get(j)) && i != j) {
                        return SendError.sendBadRequest("You can invite only once for each user", response);
                    }
                }
            }

            if (guestEmails.contains(dbUser.getEmail()))
                return SendError.sendBadRequest("Cannot invite yourself to your schedule", response);


            if (guestEmails.contains("caplandar@gmail.com"))
                return SendError.sendBadRequest("Cannot invite admin to your schedule", response);

            for (int i = 0; i < guestEmails.size(); i++) {
                User user = userService.findByEmail(guestEmails.get(i));
                if (user == null) {
                    return SendError.sendBadRequest("There is no user who has email - " + guestEmails.get(i), response);
                }
                guests.add(user);
            }

//            Remove old guests of the schedule
            guestService.deleteBySchedule(dbSchedule);

//            Add new guests to the schedule
            for (int i = 0; i < guests.size(); i++) {
                guestService.save(new Guest(0, dbSchedule, guests.get(i)));
            }
        }

        dbSchedule = scheduleService.save(schedule);
        dbSchedule.setGuests(schedule.getGuests());

        Map<String, Schedule> responseBody = new HashMap<>();

        responseBody.put("data", dbSchedule);

        return ResponseEntity.ok(responseBody);
    }

    @DeleteMapping("/schedules/{id}")
    public ResponseEntity<Object> deleteSchedule(@PathVariable int id, HttpServletResponse response, HttpServletRequest request) {
        if (authRestController.protect(response, request) != null) return null;

        Schedule schedule = scheduleService.findById(id);

        if (schedule == null) {
            return SendError.sendNotFound("There is no schedule with id - " + id, response);
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

        if (!schedule.getUser().equals(dbUser)) {
            return SendError.sendBadRequest("You are not allowed to delete this schedule", response);
        }

        scheduleService.deleteById(id);

        Map<String, String> responseBody = new HashMap<>();

        responseBody.put("status", "success");
        responseBody.put("message", "Schedule was deleted");

        return ResponseEntity.ok(responseBody);
    }
}
