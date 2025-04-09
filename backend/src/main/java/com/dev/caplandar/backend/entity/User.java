package com.dev.caplandar.backend.entity;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;

@Entity
@Table(name="USER")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "U_ID")
    private int id;

    @Column(name = "U_Email")
    private String email;

    @Column(name = "U_Username")
    private String username;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Column(name = "U_Password")
    private String password;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Column(name = "U_Avatar")
    private String avatar;

    @Column(name = "U_Verified")
    private boolean verified;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Transient
    private String currentPassword, newPassword, confirmPassword;

    public User() {}

    public User(String email, String username, String password, String avatar) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.avatar = avatar;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }

    @Override
    public String toString() {
        return "{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", avatar=" + avatar +
                '}';
    }
}
