package com.campusone.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
@Slf4j
public class FirebaseConfig {

    @Value("${firebase.service-account-path}")
    private String serviceAccountPath;

    @PostConstruct
    public void initializeFirebase() {
        try {
            if (FirebaseApp.getApps().isEmpty()) {
                InputStream serviceAccount = loadServiceAccount();
                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();
                FirebaseApp.initializeApp(options);
                log.info("Firebase Admin SDK initialized successfully");
            } else {
                log.info("Firebase Admin SDK already initialized");
            }
        } catch (IOException e) {
            log.error("Failed to initialize Firebase Admin SDK: {}", e.getMessage());
            throw new RuntimeException("Failed to initialize Firebase Admin SDK", e);
        }
    }

    private InputStream loadServiceAccount() throws IOException {
        // Try absolute/relative file path first
        Path path = Paths.get(serviceAccountPath);
        if (Files.exists(path)) {
            log.debug("Loading Firebase service account from file: {}", path.toAbsolutePath());
            return new FileInputStream(path.toFile());
        }
        // Fall back to classpath
        ClassPathResource resource = new ClassPathResource(serviceAccountPath);
        if (resource.exists()) {
            log.debug("Loading Firebase service account from classpath: {}", serviceAccountPath);
            return resource.getInputStream();
        }
        throw new IOException("Firebase service account file not found at: " + serviceAccountPath +
                ". Please set FIREBASE_SERVICE_ACCOUNT_PATH environment variable.");
    }
}
