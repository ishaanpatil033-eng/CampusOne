package com.campusone.repository;

import com.campusone.entity.OrderStatus;
import com.campusone.entity.PrintQOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrintQOrderRepository extends JpaRepository<PrintQOrder, Long> {
    List<PrintQOrder> findByUserUidOrderByCreatedAtDesc(String userUid);
    List<PrintQOrder> findByStatusOrderByCreatedAtAsc(OrderStatus status);
}
