package com.dev.caplandar.backend.service;

import com.dev.caplandar.backend.entity.Category;
import com.dev.caplandar.backend.entity.Schedule;
import com.dev.caplandar.backend.entity.User;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;

public interface ScheduleService {
    List<Schedule> findAll();

    List<Schedule> findByUser(User user);

    List<Schedule> findByTitle(String title);

    List<Schedule> findByDate(Date date);

    List<Schedule> findByLocation(String location);

    List<Schedule> findByCategory(Category category);

    Schedule findById(int id);

    Schedule save(Schedule schedule);

    void deleteById(int id);
}
