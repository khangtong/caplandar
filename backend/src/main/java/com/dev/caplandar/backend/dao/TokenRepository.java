package com.dev.caplandar.backend.dao;

import com.dev.caplandar.backend.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Integer> {
    Optional<Token> findByTokenHash(String token);

    @Modifying
    @Query("DELETE FROM Token t WHERE t.expiresAt < :now OR t.used = true")
    void deleteExpiredOrUsedTokens(@Param("now") LocalDateTime now);
}
