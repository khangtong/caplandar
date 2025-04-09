package com.dev.caplandar.backend.dao;

import com.dev.caplandar.backend.entity.Guest;
import com.dev.caplandar.backend.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GuestRepository extends JpaRepository<Guest, Integer> {
    List<Guest> findBySchedule(Schedule schedule);
}
