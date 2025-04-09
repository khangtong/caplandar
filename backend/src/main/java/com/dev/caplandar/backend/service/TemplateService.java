package com.dev.caplandar.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Service
public class TemplateService {
    private ResourceLoader resourceLoader;

    @Autowired
    public TemplateService(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    public String loadHtmlTemplate(String templateName) throws IOException {
        return new String(Files.readAllBytes(Paths.get(resourceLoader.getResource("classpath:" + templateName).getURI())));
    }
}
