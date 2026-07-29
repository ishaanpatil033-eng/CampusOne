package com.campusone.repository;

import com.campusone.entity.StudyMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudyMaterialRepository extends JpaRepository<StudyMaterial, Long> {

    List<StudyMaterial> findAllByOrderByCreatedAtDesc();

    List<StudyMaterial> findBySubjectIgnoreCaseOrderByCreatedAtDesc(String subject);

    List<StudyMaterial> findByDepartmentIgnoreCaseOrderByCreatedAtDesc(String department);

    List<StudyMaterial> findBySubjectIgnoreCaseAndDepartmentIgnoreCaseOrderByCreatedAtDesc(
            String subject, String department
    );

    List<StudyMaterial> findByUploadedByUidOrderByCreatedAtDesc(String uid);
}
