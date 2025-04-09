package com.dev.caplandar.backend.service;

import com.dev.caplandar.backend.dao.BlacklistRepository;
import com.dev.caplandar.backend.entity.Blacklist;
import com.dev.caplandar.backend.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BlacklistServiceImpl implements BlacklistService {
    private BlacklistRepository blacklistRepository;

    @Autowired
    public BlacklistServiceImpl(BlacklistRepository blacklistRepository) {
        this.blacklistRepository = blacklistRepository;
    }

    @Override
    public List<Blacklist> findAll() {
        return blacklistRepository.findAll();
    }

    @Override
    public Blacklist findById(int id) {
        return blacklistRepository.findById(id).orElse(null);
    }

    @Override
    public List<Blacklist> findByUser(User user) {
        return blacklistRepository.findByUser(user);
    }

    @Override
    public List<Blacklist> findByBlacklist(User blacklist) {
        return blacklistRepository.findByBlacklist(blacklist);
    }

    @Override
    public Blacklist save(Blacklist blacklist) {
        return blacklistRepository.save(blacklist);
    }

    @Override
    public void deleteById(int id) {
        blacklistRepository.deleteById(id);
    }

    @Override
    public void deleteByUser(User user) {
        List<Blacklist> blacklists = this.findByUser(user);

        for (int i = 0; i < blacklists.size(); i++) {
            this.deleteById(blacklists.get(i).getId());
        }
    }
}
