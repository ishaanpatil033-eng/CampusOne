package com.campusone.service.impl;

import com.campusone.dto.request.CreatePrintQOrderRequest;
import com.campusone.dto.response.PrintQOrderResponse;
import com.campusone.entity.OrderStatus;
import com.campusone.entity.PrintQOrder;
import com.campusone.exception.ResourceNotFoundException;
import com.campusone.repository.PrintQOrderRepository;
import com.campusone.service.PrintQOrderService;
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
public class PrintQOrderServiceImpl implements PrintQOrderService {

    private final PrintQOrderRepository repo;

    @Override
    public List<PrintQOrderResponse> getUserOrders(String userUid) {
        return repo.findByUserUidOrderByCreatedAtDesc(userUid)
                .stream().map(PrintQOrderResponse::fromEntity).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PrintQOrderResponse createOrder(CreatePrintQOrderRequest req, String userUid, String userName) {
        PrintQOrder order = PrintQOrder.builder()
                .userUid(userUid)
                .userName(userName)
                .fileUrl(req.getFileUrl())
                .fileName(req.getFileName())
                .pageCount(req.getPageCount())
                .isColor(req.getIsColor())
                .spiralBinding(req.getSpiralBinding())
                .lamination(req.getLamination())
                .pickupTimeSlot(req.getPickupTimeSlot())
                .status(OrderStatus.PENDING)
                .build();
        PrintQOrder saved = repo.save(order);
        log.info("PrintQ order created: id={}, user={}", saved.getId(), userUid);
        return PrintQOrderResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public PrintQOrderResponse updateStatus(Long id, OrderStatus status) {
        PrintQOrder order = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PrintQOrder", "id", id));
        order.setStatus(status);
        return PrintQOrderResponse.fromEntity(repo.save(order));
    }
}
