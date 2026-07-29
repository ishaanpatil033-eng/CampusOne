package com.campusone.service.impl;

import com.campusone.dto.request.CreateEventRequest;
import com.campusone.dto.response.EventResponse;
import com.campusone.entity.*;
import com.campusone.exception.ResourceNotFoundException;
import com.campusone.repository.EventAttendeeRepository;
import com.campusone.repository.EventRepository;
import com.campusone.service.EventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class EventServiceImpl implements EventService {

    private final EventRepository     eventRepo;
    private final EventAttendeeRepository attendeeRepo;

    @Override
    public List<EventResponse> getEvents(EventCategory category, String userUid) {
        List<Event> events = (category != null)
                ? eventRepo.findByCategoryActive(category)
                : eventRepo.findAllActive();

        Set<Long> registeredIds = (userUid != null)
                ? attendeeRepo.findEventIdsByUserUid(userUid)
                : Set.of();

        return events.stream()
                .map(e -> EventResponse.fromEntity(e, registeredIds.contains(e.getId())))
                .collect(Collectors.toList());
    }

    @Override
    public Optional<EventResponse> getById(Long id, String userUid) {
        return eventRepo.findById(id).map(e -> {
            boolean registered = userUid != null && attendeeRepo.existsByEventIdAndUserUid(id, userUid);
            return EventResponse.fromEntity(e, registered);
        });
    }

    @Override
    @Transactional
    public EventResponse create(CreateEventRequest req, String organizerUid, String organizerName) {
        Event event = Event.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .eventDate(req.getEventDate())
                .eventEndDate(req.getEventEndDate())
                .location(req.getLocation())
                .maxAttendees(req.getMaxAttendees())
                .category(req.getCategory() != null ? req.getCategory() : EventCategory.OTHER)
                .imageUrl(req.getImageUrl())
                .organizer(req.getOrganizer() != null ? req.getOrganizer() : organizerName)
                .organizerUid(organizerUid)
                .build();
        Event saved = eventRepo.save(event);
        log.info("Event created: id={}, title={}", saved.getId(), saved.getTitle());
        return EventResponse.fromEntity(saved, false);
    }

    @Override
    @Transactional
    public EventResponse register(Long eventId, String userUid, String userName, String userEmail) {
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));

        if (event.getStatus() == EventStatus.CANCELLED || event.getStatus() == EventStatus.COMPLETED) {
            throw new IllegalStateException("Cannot register for a " + event.getStatus().name().toLowerCase() + " event");
        }
        if (attendeeRepo.existsByEventIdAndUserUid(eventId, userUid)) {
            throw new IllegalStateException("You are already registered for this event");
        }
        if (event.getMaxAttendees() != null && event.getCurrentAttendees() >= event.getMaxAttendees()) {
            throw new IllegalStateException("Event is at full capacity");
        }

        EventAttendee attendee = EventAttendee.builder()
                .event(event)
                .userUid(userUid)
                .userName(userName)
                .userEmail(userEmail)
                .build();
        attendeeRepo.save(attendee);

        event.setCurrentAttendees(event.getCurrentAttendees() + 1);
        eventRepo.save(event);

        log.info("User {} registered for event {}", userUid, eventId);
        return EventResponse.fromEntity(event, true);
    }

    @Override
    @Transactional
    public EventResponse unregister(Long eventId, String userUid) {
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", eventId));

        if (!attendeeRepo.existsByEventIdAndUserUid(eventId, userUid)) {
            throw new IllegalStateException("You are not registered for this event");
        }

        attendeeRepo.deleteByEventIdAndUserUid(eventId, userUid);
        if (event.getCurrentAttendees() > 0) {
            event.setCurrentAttendees(event.getCurrentAttendees() - 1);
            eventRepo.save(event);
        }

        log.info("User {} unregistered from event {}", userUid, eventId);
        return EventResponse.fromEntity(event, false);
    }
}
