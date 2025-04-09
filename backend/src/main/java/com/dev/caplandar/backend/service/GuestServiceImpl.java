package com.dev.caplandar.backend.service;

import com.dev.caplandar.backend.dao.GuestRepository;
import com.dev.caplandar.backend.entity.Guest;
import com.dev.caplandar.backend.entity.Schedule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GuestServiceImpl implements GuestService {
    private GuestRepository guestRepository;

    @Autowired
    public GuestServiceImpl(GuestRepository guestRepository) {
        this.guestRepository = guestRepository;
    }

    @Override
    public List<Guest> findAll() {
        return guestRepository.findAll();
    }

    @Override
    public Guest findById(int id) {
        return guestRepository.findById(id).orElse(null);
    }

    @Override
    public List<Guest> findBySchedule(Schedule schedule) {
        return guestRepository.findBySchedule(schedule);
    }

    @Override
    public Guest save(Guest guest) {
        return guestRepository.save(guest);
    }

    @Override
    public void deleteById(int id) {
        guestRepository.deleteById(id);
    }

    @Override
    public void deleteBySchedule(Schedule schedule) {
        List<Guest> guests = this.findBySchedule(schedule);

        for (int i = 0; i < guests.size(); i++) {
            this.deleteById(guests.get(i).getId());
        }
    }
}
