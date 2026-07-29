package com.campusone.service.impl;

import com.campusone.dto.request.CreateStudyMaterialRequest;
import com.campusone.dto.response.StudyMaterialResponse;
import com.campusone.entity.StudyMaterial;
import com.campusone.repository.StudyMaterialRepository;
import com.campusone.service.StudyMaterialService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class StudyMaterialServiceImpl implements StudyMaterialService {

    private final StudyMaterialRepository repo;

    @Override
    public List<StudyMaterialResponse> getMaterials(String subject, String department) {
        List<StudyMaterial> results;
        if (subject != null && department != null) {
            results = repo.findBySubjectIgnoreCaseAndDepartmentIgnoreCaseOrderByCreatedAtDesc(subject, department);
        } else if (subject != null) {
            results = repo.findBySubjectIgnoreCaseOrderByCreatedAtDesc(subject);
        } else if (department != null) {
            results = repo.findByDepartmentIgnoreCaseOrderByCreatedAtDesc(department);
        } else {
            results = repo.findAllByOrderByCreatedAtDesc();
        }
        log.debug("Fetched {} study materials (subject={}, department={})", results.size(), subject, department);
        return results.stream().map(StudyMaterialResponse::fromEntity).collect(Collectors.toList());
    }

    @Override
    public Optional<StudyMaterialResponse> getById(Long id) {
        return repo.findById(id).map(StudyMaterialResponse::fromEntity);
    }

    @Override
    @Transactional
    public StudyMaterialResponse create(CreateStudyMaterialRequest req, String uploaderUid, String uploaderName) {
        StudyMaterial material = StudyMaterial.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .fileUrl(req.getFileUrl())
                .fileName(req.getFileName())
                .fileType(req.getFileType())
                .subject(req.getSubject())
                .department(req.getDepartment())
                .uploadedByUid(uploaderUid)
                .uploadedByName(uploaderName)
                .build();
        StudyMaterial saved = repo.save(material);
        log.info("Study material created: id={}, title={}", saved.getId(), saved.getTitle());
        return StudyMaterialResponse.fromEntity(saved);
    }
}
