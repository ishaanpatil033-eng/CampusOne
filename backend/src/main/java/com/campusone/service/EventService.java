package com.campusone.service;

import com.campusone.dto.request.CreateEventRequest;
import com.campusone.dto.response.EventResponse;
import com.campusone.entity.EventCategory;

import java.util.List;
import java.util.Optional;

public interface EventService {

    List<EventResponse> getEvents(EventCategory category, String userUid);

    Optional<EventResponse> getById(Long id, String userUid);

    EventResponse create(CreateEventRequest request, String organizerUid, String organizerName);

    EventResponse register(Long eventId, String userUid, String userName, String userEmail);

    EventResponse unregister(Long eventId, String userUid);
}
