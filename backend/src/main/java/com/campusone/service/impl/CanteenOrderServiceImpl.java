package com.campusone.service.impl;

import com.campusone.dto.request.CreateCanteenOrderRequest;
import com.campusone.dto.response.CanteenOrderResponse;
import com.campusone.entity.CanteenOrder;
import com.campusone.entity.OrderStatus;
import com.campusone.exception.ResourceNotFoundException;
import com.campusone.repository.CanteenOrderRepository;
import com.campusone.service.CanteenOrderService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CanteenOrderServiceImpl implements CanteenOrderService {

    private final CanteenOrderRepository repo;
    private final ObjectMapper objectMapper;

    @Override
    public List<CanteenOrderResponse> getUserOrders(String userUid) {
        return repo.findByUserUidOrderByCreatedAtDesc(userUid)
                .stream().map(CanteenOrderResponse::fromEntity).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CanteenOrderResponse createOrder(CreateCanteenOrderRequest req, String userUid, String userName) {
        try {
            String itemsJson = objectMapper.writeValueAsString(req.getItems());
            CanteenOrder order = CanteenOrder.builder()
                    .userUid(userUid)
                    .userName(userName)
                    .itemsJson(itemsJson)
                    .totalAmount(req.getTotalAmount())
                    .status(OrderStatus.PENDING)
                    .build();
            CanteenOrder saved = repo.save(order);
            log.info("Canteen order created: id={}, user={}", saved.getId(), userUid);
            return CanteenOrderResponse.fromEntity(saved);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize order items", e);
            throw new RuntimeException("Failed to process order items");
        }
    }

    @Override
    @Transactional
    public CanteenOrderResponse updateStatus(Long id, OrderStatus status) {
        CanteenOrder order = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CanteenOrder", "id", id));
        order.setStatus(status);
        return CanteenOrderResponse.fromEntity(repo.save(order));
    }
}
