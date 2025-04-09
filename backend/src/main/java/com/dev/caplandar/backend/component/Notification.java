package com.dev.caplandar.backend.component;

import com.dev.caplandar.backend.entity.Guest;
import com.dev.caplandar.backend.entity.Schedule;
import com.dev.caplandar.backend.entity.User;
import com.dev.caplandar.backend.service.EmailService;
import com.dev.caplandar.backend.service.GuestService;
import com.dev.caplandar.backend.service.ScheduleService;
import com.dev.caplandar.backend.service.TemplateService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Component
public class Notification {
    private EmailService emailService;
    private ScheduleService scheduleService;
    private TemplateService templateService;
    private GuestService guestService;

    @Autowired
    public Notification(EmailService emailService, ScheduleService scheduleService, TemplateService templateService, GuestService guestService) {
        this.emailService = emailService;
        this.scheduleService = scheduleService;
        this.templateService = templateService;
        this.guestService = guestService;
    }

    @Scheduled(fixedRate = 1, timeUnit = TimeUnit.MINUTES)
    public void notifySchedule() {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        LocalDateTime now = LocalDateTime.now().truncatedTo(ChronoUnit.MINUTES);
        Date today = null;
        try {
            today = dateFormat.parse(dateFormat.format(new Date()));
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }

        List<Schedule> schedules = scheduleService.findByDate(today);

        for (int i = 0; i < schedules.size(); i++) {
            if (schedules.get(i).getNoti() == null) continue;
            if (schedules.get(i).getNoti().truncatedTo(ChronoUnit.MINUTES).equals(now)) {
                String to = schedules.get(i).getUser().getEmail();
                String username = schedules.get(i).getUser().getUsername();
                String title = schedules.get(i).getTitle();
                String timeFrom = schedules.get(i).getTimeFrom().toString();
                String timeTo = schedules.get(i).getTimeTo().toString();
                String location = schedules.get(i).getLocation();
                List<Guest> dbGuests = guestService.findBySchedule(schedules.get(i));

                try {
                    String htmlContent = templateService.loadHtmlTemplate("templates/notification.html")
                            .replace("{{username}}", username)
                            .replace("{{title}}", title)
                            .replace("{{timeFrom}}", timeFrom)
                            .replace("{{timeTo}}", timeTo);

                    if (location != null) {
                        htmlContent = htmlContent.replace("{{location}}", "<p>You will do it in <strong>" + location + "</strong>.</p>");
                    } else {
                        htmlContent = htmlContent.replace("{{location}}", "");
                    }

                    emailService.sendHtmlEmail(to, "Notification for <" + title + ">", htmlContent);

//                    Send email to guests of the schedule
                    for (int j = 0; j < dbGuests.size(); j++) {
                        User guest = dbGuests.get(j).getUser();

                        String htmlContentForGuests = templateService.loadHtmlTemplate("templates/notification.html")
                                .replace("{{username}}", guest.getUsername())
                                .replace("{{title}}", title)
                                .replace("{{timeFrom}}", timeFrom)
                                .replace("{{timeTo}}", timeTo);

                        if (location != null) {
                            htmlContentForGuests = htmlContentForGuests.replace("{{location}}", "<p>You will do it in <strong>" + location + "</strong> with <strong>" + username + "</strong> (who invited you to this schedule).</p>");
                        } else {
                            htmlContentForGuests = htmlContentForGuests.replace("{{location}}", "");
                        }

                        emailService.sendHtmlEmail(guest.getEmail(), "Notification for <" + title + ">", htmlContentForGuests);
                    }
                } catch (IOException | MessagingException e) {
                    throw new RuntimeException(e);
                }
            }
        }
    }
}
