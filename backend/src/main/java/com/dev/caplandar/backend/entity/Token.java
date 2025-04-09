package com.dev.caplandar.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "TOKEN")
public class Token {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "T_ID")
    private Long id;

    @Column(name = "T_Token")
    private String tokenHash; // Store hashed token

    @Column(name = "T_Createdat")
    private LocalDateTime createdAt;

    @Column(name = "T_Expiresat")
    private LocalDateTime expiresAt;

    @Column(name = "T_Used")
    private boolean used;

    @Column(name = "T_Action")
    private String actionType;

    @ManyToOne
    @JoinColumn(name = "U_ID")
    private User user;

    public Token() {};

    public Token(String tokenHash, LocalDateTime createdAt, LocalDateTime expiresAt, boolean used, String actionType, User user) {
        this.tokenHash = tokenHash;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
        this.used = used;
        this.actionType = actionType;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTokenHash() {
        return tokenHash;
    }

    public void setTokenHash(String tokenHash) {
        this.tokenHash = tokenHash;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public boolean isUsed() {
        return used;
    }

    public void setUsed(boolean used) {
        this.used = used;
    }

    public String getActionType() {
        return actionType;
    }

    public void setActionType(String actionType) {
        this.actionType = actionType;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public String toString() {
        return "Token{" +
                "id=" + id +
                ", tokenHash='" + tokenHash + '\'' +
                ", createdAt=" + createdAt +
                ", expiresAt=" + expiresAt +
                ", used=" + used +
                ", actionType='" + actionType + '\'' +
                ", user=" + user +
                '}';
    }
}
