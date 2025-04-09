package com.dev.caplandar.backend.entity;

import jakarta.persistence.*;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDateTime;

@Entity
@Table(name = "SCHEDULE")
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "S_ID")
    private int id;

    @Column(name = "S_Title")
    private String title;

    @Column(name = "S_Date")
    private Date date;

    @Column(name = "S_Timefrom")
    private Time timeFrom;

    @Column(name = "S_Timeto")
    private Time timeTo;

    @Column(name = "S_Location")
    private String location;

    @Column(name = "S_Noti")
    private LocalDateTime noti;

    @ManyToOne
    @JoinColumn(name = "U_ID")
    private User user;

    @ManyToOne
    @JoinColumn(name = "C_ID")
    private Category category;

    @Transient
    private String guests;

    public Schedule() {}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Time getTimeFrom() {
        return timeFrom;
    }

    public void setTimeFrom(Time timeFrom) {
        this.timeFrom = timeFrom;
    }

    public Time getTimeTo() {
        return timeTo;
    }

    public void setTimeTo(Time timeTo) {
        this.timeTo = timeTo;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDateTime getNoti() {
        return noti;
    }

    public void setNoti(LocalDateTime noti) {
        this.noti = noti;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getGuests() {
        return guests;
    }

    public void setGuests(String guests) {
        this.guests = guests;
    }

    @Override
    public String toString() {
        return "Schedule{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", date=" + date +
                ", timeFrom=" + timeFrom +
                ", timeTo=" + timeTo +
                ", location='" + location + '\'' +
                ", noti=" + noti +
                ", user=" + user +
                ", category=" + category +
                ", guests='" + guests + '\'' +
                '}';
    }
}
