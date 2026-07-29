package com.campusone.repository;

import com.campusone.entity.ItemCategory;
import com.campusone.entity.ItemStatus;
import com.campusone.entity.ItemType;
import com.campusone.entity.LostFoundItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LostFoundRepository extends JpaRepository<LostFoundItem, Long> {

    List<LostFoundItem> findAllByOrderByCreatedAtDesc();

    List<LostFoundItem> findByTypeOrderByCreatedAtDesc(ItemType type);

    List<LostFoundItem> findByStatusOrderByCreatedAtDesc(ItemStatus status);

    List<LostFoundItem> findByTypeAndStatusOrderByCreatedAtDesc(ItemType type, ItemStatus status);

    @Query("SELECT l FROM LostFoundItem l WHERE l.type = :type AND l.category = :category ORDER BY l.createdAt DESC")
    List<LostFoundItem> findByTypeAndCategory(
            @Param("type")     ItemType type,
            @Param("category") ItemCategory category
    );

    @Query("SELECT l FROM LostFoundItem l WHERE " +
           "(LOWER(l.title) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           " LOWER(l.description) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           " LOWER(l.location) LIKE LOWER(CONCAT('%', :q, '%'))) " +
           "ORDER BY l.createdAt DESC")
    List<LostFoundItem> searchByKeyword(@Param("q") String keyword);
}
