package com.campusone.repository;

import com.campusone.entity.CanteenOrder;
import com.campusone.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CanteenOrderRepository extends JpaRepository<CanteenOrder, Long> {
    List<CanteenOrder> findByUserUidOrderByCreatedAtDesc(String userUid);
    List<CanteenOrder> findByStatusOrderByCreatedAtAsc(OrderStatus status);
}
