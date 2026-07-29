package com.campusone.service.impl;

import com.campusone.dto.request.CreateTeamRequestRequest;
import com.campusone.dto.response.TeamRequestResponse;
import com.campusone.entity.TeamRequest;
import com.campusone.entity.TeamRequestStatus;
import com.campusone.exception.ResourceNotFoundException;
import com.campusone.repository.TeamRequestRepository;
import com.campusone.service.TeamRequestService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class TeamRequestServiceImpl implements TeamRequestService {

    private final TeamRequestRepository repo;

    @Override
    public List<TeamRequestResponse> getRequests(String skill, TeamRequestStatus status) {
        List<TeamRequest> results;
        if (skill != null && status != null) {
            results = repo.findBySkillAndStatus(skill, status);
        } else if (skill != null) {
            results = repo.findBySkill(skill);
        } else if (status != null) {
            results = repo.findByStatusOrderByCreatedAtDesc(status);
        } else {
            results = repo.findAllByOrderByCreatedAtDesc();
        }
        log.debug("Fetched {} team requests (skill={}, status={})", results.size(), skill, status);
        return results.stream().map(TeamRequestResponse::fromEntity).collect(Collectors.toList());
    }

    @Override
    public Optional<TeamRequestResponse> getById(Long id) {
        return repo.findById(id).map(TeamRequestResponse::fromEntity);
    }

    @Override
    @Transactional
    public TeamRequestResponse create(CreateTeamRequestRequest req, String posterUid, String posterName) {
        TeamRequest tr = TeamRequest.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .projectType(req.getProjectType())
                .requiredSkills(req.getRequiredSkills())
                .teamSize(req.getTeamSize())
                .currentSize(1)
                .contactInfo(req.getContactInfo())
                .postedByUid(posterUid)
                .postedByName(posterName)
                .build();
        TeamRequest saved = repo.save(tr);
        log.info("Team request created: id={}, title={}", saved.getId(), saved.getTitle());
        return TeamRequestResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public TeamRequestResponse toggleStatus(Long id, String requesterUid) {
        TeamRequest tr = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TeamRequest", "id", id));

        if (!tr.getPostedByUid().equals(requesterUid)) {
            throw new AccessDeniedException("You can only modify your own team requests");
        }

        TeamRequestStatus next = tr.getStatus() == TeamRequestStatus.OPEN
                ? TeamRequestStatus.CLOSED
                : TeamRequestStatus.OPEN;
        tr.setStatus(next);
        TeamRequest saved = repo.save(tr);
        log.info("Team request {} status toggled to {}", id, next);
        return TeamRequestResponse.fromEntity(saved);
    }
}
