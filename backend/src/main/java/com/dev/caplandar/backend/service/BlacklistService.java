package com.dev.caplandar.backend.service;

import com.dev.caplandar.backend.entity.Blacklist;
import com.dev.caplandar.backend.entity.User;

import java.util.List;

public interface BlacklistService {
    List<Blacklist> findAll();

    Blacklist findById(int id);

    List<Blacklist> findByUser(User user);

    List<Blacklist> findByBlacklist(User blacklist);

    Blacklist save(Blacklist blacklist);

    void deleteById(int id);

    void deleteByUser(User user);
}
