package com.campusone.config;

import com.campusone.entity.*;
import com.campusone.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements ApplicationRunner {

    private final AnnouncementRepository  announcementRepository;
    private final StudyMaterialRepository studyMaterialRepository;
    private final TeamRequestRepository   teamRequestRepository;
    private final EventRepository         eventRepository;
    private final LostFoundRepository     lostFoundRepository;
    private final CanteenOrderRepository  canteenOrderRepository;
    private final PrintQOrderRepository   printQOrderRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (announcementRepository.count()  == 0) seedAnnouncements();
        if (studyMaterialRepository.count() == 0) seedStudyMaterials();
        if (teamRequestRepository.count()   == 0) seedTeamRequests();
        if (eventRepository.count()         == 0) seedEvents();
        if (lostFoundRepository.count()     == 0) seedLostFoundItems();
        if (canteenOrderRepository.count()  == 0) seedCanteenOrders();
        if (printQOrderRepository.count()   == 0) seedPrintQOrders();
    }

    private void seedAnnouncements() {
        log.info("Seeding announcements...");
        announcementRepository.saveAll(List.of(
            Announcement.builder().title("Mid-Semester Exam Schedule Released").content("Exams begin on August 5th.").type(AnnouncementType.URGENT).author("Examination Cell").isPinned(true).expiresAt(LocalDateTime.now().plusDays(30)).build(),
            Announcement.builder().title("Campus Wi-Fi Maintenance").content("Network unavailable 12–4 AM.").type(AnnouncementType.URGENT).author("IT Department").expiresAt(LocalDateTime.now().plusDays(2)).build()
        ));
    }

    private void seedStudyMaterials() {
        log.info("Seeding study materials...");
        studyMaterialRepository.saveAll(List.of(
            StudyMaterial.builder().title("Introduction to Data Structures").description("Arrays, Linked Lists, Trees.").fileUrl("https://example.com/ds-notes.pdf").fileName("ds_notes.pdf").fileType(FileType.PDF).subject("Computer Science").uploadedByName("Rohan Mehta").build(),
            StudyMaterial.builder().title("Calculus Cheat Sheet").description("Substitution, by parts.").fileUrl("https://example.com/calculus.pdf").fileType(FileType.PDF).subject("Mathematics").uploadedByName("Priya Singh").build()
        ));
    }

    private void seedTeamRequests() {
        log.info("Seeding team requests...");
        teamRequestRepository.saveAll(List.of(
            TeamRequest.builder().title("React & Node.js devs for Hackathon").description("Building a campus platform.").projectType(ProjectType.HACKATHON).requiredSkills(Set.of("React", "Node.js")).teamSize(4).currentSize(1).contactInfo("rohan@campus.edu").postedByName("Rohan Mehta").build()
        ));
    }

    private void seedEvents() {
        log.info("Seeding events...");
        eventRepository.saveAll(List.of(
            Event.builder().title("Campus Hackathon 2024").description("24-hour hackathon open to all students.").eventDate(LocalDateTime.now().plusDays(17)).location("Main Auditorium").category(EventCategory.TECHNICAL).organizer("Tech Club").build(),
            Event.builder().title("Annual Sports Day 2024").description("Biggest sports event.").eventDate(LocalDateTime.now().plusDays(22)).location("College Grounds").category(EventCategory.SPORTS).organizer("Sports Committee").build()
        ));
    }

    private void seedLostFoundItems() {
        log.info("Seeding lost & found items...");
        lostFoundRepository.saveAll(List.of(
            LostFoundItem.builder().title("iPhone 14 Pro").description("Lost near library.").type(ItemType.LOST).location("Library").category(ItemCategory.ELECTRONICS).reportedByName("Sneha Patel").build(),
            LostFoundItem.builder().title("Blue Backpack").description("Found in canteen.").type(ItemType.FOUND).location("Canteen").category(ItemCategory.ACCESSORIES).reportedByName("Riya Desai").build()
        ));
    }

    private void seedCanteenOrders() {
        log.info("Seeding canteen orders...");
        canteenOrderRepository.saveAll(List.of(
            CanteenOrder.builder().userUid("mock-uid-1").userName("Rohan Mehta")
                .itemsJson("[{\"id\":\"c1\",\"name\":\"Veg Burger\",\"quantity\":2,\"price\":50.0},{\"id\":\"c2\",\"name\":\"Cold Coffee\",\"quantity\":1,\"price\":60.0}]")
                .totalAmount(160.0).status(OrderStatus.PREPARING).build(),
            CanteenOrder.builder().userUid("mock-uid-2").userName("Aisha Kapoor")
                .itemsJson("[{\"id\":\"c3\",\"name\":\"Masala Dosa\",\"quantity\":1,\"price\":80.0}]")
                .totalAmount(80.0).status(OrderStatus.READY).build()
        ));
    }

    private void seedPrintQOrders() {
        log.info("Seeding PrintQ orders...");
        printQOrderRepository.saveAll(List.of(
            PrintQOrder.builder().userUid("mock-uid-1").userName("Rohan Mehta")
                .fileUrl("https://example.com/project_report.pdf").fileName("project_report.pdf")
                .pageCount(25).isColor(true).spiralBinding(true).lamination(false)
                .pickupTimeSlot("10:00 AM - 10:30 AM").status(OrderStatus.PENDING).build(),
            PrintQOrder.builder().userUid("mock-uid-3").userName("Dev Sharma")
                .fileUrl("https://example.com/notes.pdf").fileName("notes.pdf")
                .pageCount(10).isColor(false).spiralBinding(false).lamination(false)
                .pickupTimeSlot("12:00 PM - 12:30 PM").status(OrderStatus.COMPLETED).build()
        ));
    }
}
