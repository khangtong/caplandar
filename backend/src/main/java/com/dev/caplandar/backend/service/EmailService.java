package com.dev.caplandar.backend.service;

import com.dev.caplandar.backend.entity.Schedule;
import com.dev.caplandar.backend.entity.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.time.Duration;

@Service
public class EmailService {
    private JavaMailSender javaMailSender;
    private TokenService tokenService;
    private TemplateEngine templateEngine;

    @Autowired
    public EmailService(JavaMailSender javaMailSender, TokenService tokenService, TemplateEngine templateEngine) {
        this.javaMailSender = javaMailSender;
        this.tokenService = tokenService;
        this.templateEngine = templateEngine;
    }

    public void sendSimpleEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        javaMailSender.send(message);
    }

    public void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);

        javaMailSender.send(message);
    }

    public void sendInviteEmail(User user, User guest, Schedule schedule) throws UnsupportedEncodingException, MessagingException {
        String rawAcceptToken = tokenService.generateToken(user, "ACCEPT_INVITE", Duration.ofHours(1));

        String acceptUrl = "http://localhost:8080/api/action?token=" + URLEncoder.encode(rawAcceptToken, "UTF-8") + "&schedule=" + schedule.getId() + "&guest=" + guest.getId();

        Context context = new Context();
        context.setVariable("username", guest.getUsername());
        context.setVariable("sender", user.getUsername());
        context.setVariable("senderEmail", user.getEmail());
        context.setVariable("schedule", schedule.getTitle());
        context.setVariable("timeFrom", schedule.getTimeFrom());
        context.setVariable("timeTo", schedule.getTimeTo());
        context.setVariable("location", schedule.getLocation());
        context.setVariable("acceptUrl", acceptUrl);

        String htmlContent = templateEngine.process(
                "invite",
                context
        );

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        helper.setTo(guest.getEmail());
        helper.setSubject("Caplandar: You have been invited to a schedule");
        helper.setText(htmlContent, true);
        javaMailSender.send(message);
    }

    public void sendVerifyEmail(User user) throws UnsupportedEncodingException, MessagingException {
        String rawAcceptToken = tokenService.generateToken(user, "VERIFY_ACCOUNT", Duration.ofHours(1));

        String verifyUrl = "http://localhost:8080/api/action?token=" + URLEncoder.encode(rawAcceptToken, "UTF-8");

        Context context = new Context();
        context.setVariable("username", user.getUsername());
        context.setVariable("verifyUrl", verifyUrl);

        String htmlContent = templateEngine.process(
                "verify-account",
                context
        );

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        helper.setTo(user.getEmail());
        helper.setSubject("Caplandar: Verify your account");
        helper.setText(htmlContent, true);
        javaMailSender.send(message);
    }

    public void sendWelcomeEmail(User user) throws MessagingException {
        Context context = new Context();
        context.setVariable("username", user.getUsername());

        String htmlContent = templateEngine.process(
                "welcome",
                context
        );

        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        helper.setTo(user.getEmail());
        helper.setSubject("Caplandar: Welcome to Caplandar");
        helper.setText(htmlContent, true);
        javaMailSender.send(message);
    }
}

