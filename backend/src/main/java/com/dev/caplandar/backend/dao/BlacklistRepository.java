package com.dev.caplandar.backend.dao;

import com.dev.caplandar.backend.entity.Blacklist;
import com.dev.caplandar.backend.entity.Guest;
import com.dev.caplandar.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BlacklistRepository  extends JpaRepository<Blacklist, Integer> {
    List<Blacklist> findByUser(User user);

    List<Blacklist> findByBlacklist(User blacklist);
}
