package com.dev.caplandar.backend.service;

import com.dev.caplandar.backend.dao.TokenRepository;
import com.dev.caplandar.backend.entity.Token;
import com.dev.caplandar.backend.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;

@Service
public class TokenService {
    private TokenRepository tokenRepository;

    @Autowired
    public TokenService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    public String generateToken(User user, String actionType, Duration duration) {
        String rawToken = generateRandomToken();
        String hashedToken = hashToken(rawToken);

        Token token = new Token();
        token.setTokenHash(hashedToken);
        token.setCreatedAt(LocalDateTime.now());
        token.setExpiresAt(LocalDateTime.now().plus(duration));
        token.setUsed(false);
        token.setActionType(actionType);
        token.setUser(user);

        tokenRepository.save(token);
        return rawToken; // Return raw token for the email
    }

    private String generateRandomToken() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[32]; // 256-bit token
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hashBytes);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Hashing algorithm not available.", e);
        }
    }

    public boolean validateToken(String rawToken) {
        String hashedToken = hashToken(rawToken);
        Optional<Token> tokenOpt = tokenRepository.findByTokenHash(hashedToken);

        return tokenOpt.isPresent()
                && !tokenOpt.get().isUsed()
                && LocalDateTime.now().isBefore(tokenOpt.get().getExpiresAt());
    }

    public Optional<Token> getToken(String rawToken) {
        String hashedToken = hashToken(rawToken);
        return tokenRepository.findByTokenHash(hashedToken);
    }

    @Transactional
    public void invalidateToken(String rawToken) {
        String hashedToken = hashToken(rawToken);
        tokenRepository.findByTokenHash(hashedToken).ifPresent(token -> {
            token.setUsed(true);
            tokenRepository.save(token);
        });
    }

    @Scheduled(cron = "0 0 3 * * ?") // Runs daily at 3 AM
    @Transactional
    public void deleteExpiredAndUsedTokens() {
        // Delete tokens that are expired OR marked as "used"
        tokenRepository.deleteExpiredOrUsedTokens(LocalDateTime.now());
    }
}
