package com.dev.caplandar.backend.service;

import com.dev.caplandar.backend.entity.Guest;
import com.dev.caplandar.backend.entity.Schedule;

import java.util.List;

public interface GuestService {
    List<Guest> findAll();

    Guest findById(int id);

    List<Guest> findBySchedule(Schedule schedule);

    Guest save(Guest guest);

    void deleteById(int id);

    void deleteBySchedule(Schedule schedule);
}
