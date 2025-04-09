package com.dev.caplandar.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "BLACKLIST")
public class Blacklist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "B_ID")
    private int id;

    @ManyToOne
    @JoinColumn(name = "B_User")
    private User user;

    @ManyToOne
    @JoinColumn(name = "B_Blacklist")
    private User blacklist;

    public Blacklist() {
    }

    public Blacklist(int id, User user, User blacklist) {
        this.id = id;
        this.user = user;
        this.blacklist = blacklist;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public User getBlacklist() {
        return blacklist;
    }

    public void setBlacklist(User blacklist) {
        this.blacklist = blacklist;
    }

    @Override
    public String toString() {
        return "Blacklist{" +
                "id=" + id +
                ", user=" + user +
                ", blacklist=" + blacklist +
                '}';
    }
}
