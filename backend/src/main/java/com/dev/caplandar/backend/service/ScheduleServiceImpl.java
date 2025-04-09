package com.dev.caplandar.backend.service;

import com.dev.caplandar.backend.dao.ScheduleRepository;
import com.dev.caplandar.backend.entity.Category;
import com.dev.caplandar.backend.entity.Guest;
import com.dev.caplandar.backend.entity.Schedule;
import com.dev.caplandar.backend.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class ScheduleServiceImpl implements ScheduleService {
    private ScheduleRepository scheduleRepository;
    private GuestService guestService;

    @Autowired
    public ScheduleServiceImpl(ScheduleRepository scheduleRepository, GuestService guestService) {
        this.scheduleRepository = scheduleRepository;
        this.guestService = guestService;
    }

    public void addGuestToSchedule(Schedule schedule) {
        List<Guest> guests = guestService.findBySchedule(schedule);
        List<User> users = new ArrayList<>();

        for (int i = 0; i < guests.size(); i++) {
            users.add(guests.get(i).getUser());
        }

        schedule.setGuests(users.toString());
    }

    @Override
    public List<Schedule> findAll() {
        List<Schedule> schedules = scheduleRepository.findAll();

        for (int i = 0; i < schedules.size(); i++) {
            addGuestToSchedule(schedules.get(i));
        }

        return schedules;
    }

    @Override
    public List<Schedule> findByUser(User user) {
        List<Schedule> schedules = scheduleRepository.findByUser(user);

        for (int i = 0; i < schedules.size(); i++) {
            addGuestToSchedule(schedules.get(i));
        }

        return schedules;
    }

    @Override
    public List<Schedule> findByTitle(String title) {
        List<Schedule> schedules = scheduleRepository.findByTitle(title);

        for (int i = 0; i < schedules.size(); i++) {
            addGuestToSchedule(schedules.get(i));
        }

        return schedules;
    }

    @Override
    public List<Schedule> findByDate(Date date) {
        List<Schedule> schedules = scheduleRepository.findByDate(date);

        for (int i = 0; i < schedules.size(); i++) {
            addGuestToSchedule(schedules.get(i));
        }

        return schedules;
    }

    @Override
    public List<Schedule> findByLocation(String location) {
        List<Schedule> schedules = scheduleRepository.findByLocation(location);

        for (int i = 0; i < schedules.size(); i++) {
            addGuestToSchedule(schedules.get(i));
        }

        return schedules;
    }

    @Override
    public List<Schedule> findByCategory(Category category) {
        List<Schedule> schedules = scheduleRepository.findByCategory(category);

        for (int i = 0; i < schedules.size(); i++) {
            addGuestToSchedule(schedules.get(i));
        }

        return schedules;
    }

    @Override
    public Schedule findById(int id) {
        Schedule schedule = scheduleRepository.findById(id).orElse(null);
        if (schedule != null) addGuestToSchedule(schedule);
        return schedule;
    }

    @Override
    public Schedule save(Schedule schedule) {
        return scheduleRepository.save(schedule);
    }

    @Override
    public void deleteById(int id) {
        scheduleRepository.deleteById(id);
    }
}
