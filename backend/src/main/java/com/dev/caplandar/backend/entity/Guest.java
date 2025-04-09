package com.dev.caplandar.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "GUEST")
public class Guest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "G_ID")
    private int id;

    @ManyToOne
    @JoinColumn(name = "S_ID")
    private Schedule schedule;

    @ManyToOne
    @JoinColumn(name = "U_ID")
    private User user;

    public Guest() {
    }

    public Guest(int id, Schedule schedule, User user) {
        this.id = id;
        this.schedule = schedule;
        this.user = user;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Schedule getSchedule() {
        return schedule;
    }

    public void setSchedule(Schedule schedule) {
        this.schedule = schedule;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public String toString() {
        return "Guest{" +
                "id=" + id +
                ", schedule=" + schedule +
                ", user=" + user +
                '}';
    }
}
