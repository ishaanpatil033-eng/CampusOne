package com.campusone.service;

import com.campusone.dto.request.CreateTeamRequestRequest;
import com.campusone.dto.response.TeamRequestResponse;
import com.campusone.entity.TeamRequestStatus;

import java.util.List;
import java.util.Optional;

public interface TeamRequestService {

    List<TeamRequestResponse> getRequests(String skill, TeamRequestStatus status);

    Optional<TeamRequestResponse> getById(Long id);

    TeamRequestResponse create(CreateTeamRequestRequest request, String posterUid, String posterName);

    TeamRequestResponse toggleStatus(Long id, String requesterUid);
}
