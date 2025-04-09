package com.dev.caplandar.backend.dao;

import com.dev.caplandar.backend.entity.Category;
import com.dev.caplandar.backend.entity.Schedule;
import com.dev.caplandar.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Integer> {
    List<Schedule> findByUser(User user);

    @Query("SELECT s FROM Schedule s WHERE s.title LIKE %?1%")
    List<Schedule> findByTitle(String title);

    @Query("SELECT s FROM Schedule s WHERE s.date = ?1")
    List<Schedule> findByDate(Date date);

    @Query("SELECT s FROM Schedule s WHERE s.location LIKE %?1%")
    List<Schedule> findByLocation(String location);

    @Query("SELECT s FROM Schedule s WHERE s.category = ?1")
    List<Schedule> findByCategory(Category category);
}
