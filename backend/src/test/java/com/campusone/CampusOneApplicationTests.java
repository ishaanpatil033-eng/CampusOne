package com.campusone;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:testdb",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "firebase.service-account-path=non-existent.json"
})
class CampusOneApplicationTests {

    @Test
    void contextLoads() {
        // Context load test - Firebase init will be skipped in test
    }
}
